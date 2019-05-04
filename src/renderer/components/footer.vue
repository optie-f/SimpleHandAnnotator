<template>
  <v-footer app color="grey lighten-3" height="100">
    <v-container grid-list-xl fluid>
        <v-form>
      <v-layout  wrap  justify-center row fill-height>
        <v-flex xs2>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs2>
          <v-text-field
            v-model.number="canvasConfig.outputWidth" type="number"
            label="Output Width"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            v-model.number="canvasConfig.outputHeight" type="number"
            label="Output Height"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-btn  @click="save" class="text-none" color="success">
            Export All as CSV (s)
          </v-btn>
        </v-flex>
      </v-layout>
      </v-form>
    </v-container>
  </v-footer>
</template>

<script>
import fs from 'fs';
import { mapGetters } from 'vuex';
const { BrowserWindow, dialog } = require('electron').remote;

export default {
  name: 'annotate-footer',
  data() {
    return {
      canvasConfig: {
        outputWidth: 224,
        outputHeight: 224,
      },
    };
  },
  computed: {
    ...mapGetters([
      'currentImg',
      'ptr',
      'numImages',
      'KeyPointsCSVheader',
      'getKeyPointsCSVrowOf',
    ]),
  },
  watch: {
    canvasConfig: {
      handler(newConf) {
        this.$store.commit('SETCANVASCONFIG', newConf);
      },
      deep: true,
    },
  },
  methods: {
    writeFile(path, data) {
      fs.writeFile(path, data, (error) => {
        if (error !== null) {
          alert('save error.');
        }
      });
    },
    save() {
      if (this.currentImg) {
        const win = BrowserWindow.getFocusedWindow();
        dialog.showSaveDialog(
          win,
          {
            properties: [
              'openDirectory',
              'createDirectory',
            ],
            filters: [
              {
                name: 'Documents',
                extensions: ['csv'],
              },
            ],
          },
          (fileName) => {
            if (fileName) {
              let data = this.KeyPointsCSVheader;
              for (let i = 0; i < this.numImages.length; i += 1) {
                data += this.getKeyPointsCSVrowOf(i);
              }
              this.writeFile(fileName, data);
            }
          },
        );
      }
    },
  },
  mounted() {
    this.keydownEvent = (e) => {
      if (e.key === 's' || e.key === 'S') {
        this.save();
      }
    };
    window.addEventListener('keydown', this.keydownEvent);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydownEvent);
  },
};

</script>

<style>
  /* label {
    text-align: center;
    font-family: "Helvetica Neue", sans-serif;
    font-size: 8px;
    color: #303133;
  } */
</style>
