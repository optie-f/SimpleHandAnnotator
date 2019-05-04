<template>
  <v-layout align-center justify-center row fill-height>
    <v-stage ref="stage" :config="configKonva"
    class="elevation-2">
      <v-layer ref="imgLayer">
          <v-image ref="img" :config="configImage" />
      </v-layer>
      <v-layer ref="keyPointLayer">
        <v-group ref="keyPointGroup">
          <v-group v-for="cls in classes" :key="cls">
            <v-line :config="lineConfs[cls]"/>
            <v-circle
              v-for="(point, index) in circleConfs[cls]" :key="point.id"
              :config="point.configCircle"
              @dragstart="pointDragStart($event, cls, index)"
              @dragmove="pointDragMoving($event, cls, index)"
              @dragend="pointDragEnd($event, cls, index)"
              />
          </v-group>
        </v-group>
      </v-layer>
    </v-stage>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  const margin = 16;
  const footerHeight = 100 + (72 / 2);
  const toolbarHeight = 48 + margin + 48;
  const classColor = [
    '#FF6D00',
    '#FFD600',
    '#AEEA00',
    '#00BFA5',
    '#00B8D4'];

  // View...Window 内で canvas を表示しうる最大領域
  // canvas...
  //    FitToView==True: Output縦横比でViewを埋める領域
  //    else: OutputSizeと一致
  // image...短辺をcanvasの長辺と合わせる(空白を生まない)

  export default {
    name: 'konva-canvas',
    data() {
      return {
        circleConfs: {},
        lineConfs: {},
        configKonva: {
          x: 0,
          y: 0,
          width: 224,
          height: 224,
        },
        configImage: {
          x: 0,
          y: 0,
          width: 224,
          height: 224,
          image: null,
          draggable: true,
        },
        imageHW: 1, // srcのサイズ情報の代わりに保持している
        canvasHW: 1,
      };
    },
    watch: {
      canvasSize(newSize, oldSize) {
        this.configKonva.width = newSize.canvasWidth;
        this.configKonva.height = newSize.canvasHeight;
        this.canvasHW = newSize.canvasHeight / newSize.canvasWidth;
        if (this.configImage.image != null) { // 画像のサイズも合わせる
          const imNode = this.$refs.img.getNode();
          const pos = imNode.absolutePosition();
          this.$refs.img.getNode().absolutePosition({
            x: pos.x * (newSize.canvasWidth / oldSize.canvasWidth),
            y: pos.y * (newSize.canvasHeight / oldSize.canvasWidth),
          });
          this.scaleImgToCanvas();
          this.refreshCircleConfs();
          this.refreshLineConfs();
        }
      },
      currentImg(newfile) { // 表示するimageをcanvasに合わせる
        const image = new Image();
        const fr = new FileReader();
        fr.onload = () => {
          image.src = fr.result;
          this.configImage.image = image;
        };
        fr.readAsDataURL(newfile);
        image.onload = () => {
          this.imageHW = image.height / image.width;
          this.scaleImgToCanvas();
          this.refreshCircleConfs();
          this.refreshLineConfs();
        };
      },
      // imgDraggable(newVal) {
      //   this.configImage.draggable = newVal;
      // },
    },
    computed: {
      ...mapGetters([
        'ptr',
        'imgDraggable',
        'currentImg',
        'currentKeyPoints',
        'classes',
        'canvasSize',
      ]),
      // getters.currentKeyPoints (relative) -> data.keyPoints (abs)
      absCurrentKeyPoints() {
        const result = {};
        for (let i = 0; i < this.classes.length; i += 1) {
          const cls = this.classes[i];
          result[cls] = [];
          const points = this.currentKeyPoints[cls];
          for (let j = 0; j < points.length; j += 1) {
            if (j % 2 === 0) {
              result[cls].push(points[j] * this.configKonva.width);
            } else {
              result[cls].push(points[j] * this.configKonva.height);
            }
          }
        }
        console.log('abs Curr. KeyPoint Updated.');
        return result;
      },
    },
    methods: {
      scaleImgToCanvas() {
        console.log('scaletoCanvas');
        // キャンバスの長辺と画像の短辺を合わせる
        if (this.canvasHW <= this.imageHW) {
          this.configImage.width = this.configKonva.width;
          this.configImage.height = this.configKonva.width * this.imageHW;
        } else {
          this.configImage.height = this.configKonva.height;
          this.configImage.width = this.configKonva.height * (1 / this.imageHW);
        }
        // 画像領域外へドラッグできないようにする
        this.configImage.dragBoundFunc = (pos) => {
          const xlim = Math.max(0, this.configImage.width - this.configKonva.width);
          const ylim = Math.max(0, this.configImage.height - this.configKonva.height);
          return {
            x: Math.max(Math.min(0, pos.x), -xlim),
            y: Math.max(Math.min(0, pos.y), -ylim),
          };
        };
      },
      changeWindowSize() {
        const viewHeight = window.innerHeight - toolbarHeight - footerHeight;
        const viewWidth = window.innerWidth - (margin * 2);
        this.$store.commit('SETVIEWCONTAINERSIZE', { viewHeight, viewWidth });
      },
      pointDragStart(e, cls, index) {
        console.log('drag start:', e.target, cls, index);
        console.log('info:', this.circleConfs[cls][index]);
      },
      pointDragMoving(e, cls, index) {
        if (cls === 'palm') {
          this.lineConfs[cls].points[index * 2] =
          this.lineConfs[cls].points[(index * 2) + 2] = e.target.attrs.x;
          this.lineConfs[cls].points[index * 2] =
          this.lineConfs[cls].points[(index * 2) + 3] = e.target.attrs.y;
          for (let i = 0; i < this.classes.length; i += 1) {
            const c = this.classes[i];
            this.lineConfs[c].points[0] = e.target.attrs.x;
            this.lineConfs[c].points[1] = e.target.attrs.y;
          }
        } else {
          this.lineConfs[cls].points[(index * 2) + 2] = e.target.attrs.x;
          this.lineConfs[cls].points[(index * 2) + 3] = e.target.attrs.y;
        }
        this.circleConfs[cls][index].configCircle.x = e.target.attrs.x;
        this.circleConfs[cls][index].configCircle.y = e.target.attrs.y;
      },
      pointDragEnd(e, cls, index) {
        console.log('drag end:', e.target, cls, index);
        console.log('info:', this.circleConfs[cls][index]);
        const payload = {
          cls,
          index,
          x: e.target.attrs.x / this.configKonva.width,
          y: e.target.attrs.y / this.configKonva.height,
        };
        this.$store.commit('SETKEYPOINTS', payload);
      },
      refreshCircleConfs() {
        const result = {};
        for (let i = 0; i < this.classes.length; i += 1) {
          const cls = this.classes[i];
          result[cls] = {};
          const points = this.absCurrentKeyPoints[cls];
          for (let j = 0; j < points.length; j += 2) {
            result[cls][j / 2] = {
              id: (i * 100) + j,
              configCircle: {
                x: points[j],
                y: points[j + 1],
                radius: 5,
                fill: 'white',
                stroke: classColor[i],
                strokeWidth: 2,
                draggable: true,
              },
            };
          }
        }
        this.circleConfs = Object.assign({}, this.circleConfs, result);
        console.log('circleConfs refreshed:', result);
      },
      refreshLineConfs() {
        const result = {};
        for (let i = 0; i < this.classes.length; i += 1) {
          const cls = this.classes[i];
          result[cls] = {
            points: this.absCurrentKeyPoints.palm
              .concat(this.absCurrentKeyPoints[cls]),
            stroke: classColor[i],
            strokeWidth: 2,
          };
        }
        this.lineConfs = Object.assign({}, this.lineConfs, result);
        console.log('lineConfs refreshed:', result);
      },
    },
    mounted() {
      this.configImage.height = window.innerHeight - toolbarHeight - footerHeight;
      this.configImage.width = window.innerWidth - (margin * 2);
      this.canvasHW = this.configImage.height / this.configImage.width;
      this.$store.commit('SETVIEWCONTAINERSIZE', {
        viewHeight: this.configImage.height,
        viewWidth: this.configImage.width,
      });
      window.addEventListener('resize', this.changeWindowSize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.changeWindowSize);
    },
  };
</script>

<style>

</style>
