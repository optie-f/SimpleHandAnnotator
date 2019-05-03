<template>
  <div id="dragEventWrapper" :class="[{'-drag': dragged }]"
    @dragover.prevent="dragged = 1" @dragleave.prevent="dragged = 0"
    @drop.prevent="onInput">
  <v-app>
    <annotate-header></annotate-header>
    <v-content>
      <v-container>
        <annotateView></annotateView>
      </v-container>
    </v-content>
    <annotate-footer></annotate-footer>
  </v-app>
  </div>
</template>

<script>
  import annotateView from '@/components/view';
  import annotateHeader from '@/components/header';
  import annotateFooter from '@/components/footer';

  export default {
    name: 'hand-annotator',
    data() {
      return {
        dragged: 0,
      };
    },
    methods: {
      onInput(event) {
        this.dragged = 0;
        const fileList = event.target.files ? event.target.files : event.dataTransfer.files;
        if (fileList.length === 0) return;
        this.$store.dispatch('imread', fileList);
      },
    },
    components: {
      annotateView,
      annotateHeader,
      annotateFooter,
    },
  };
</script>

<style lang="scss">
  /* $material-design-icons-font-path: '~material-design-icons-iconfont/dist/fonts/';
  @import '~material-design-icons-iconfont/src/material-design-icons'; */
</style>
