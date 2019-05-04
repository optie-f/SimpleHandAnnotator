<template>
  <v-toolbar app class="elevation-0"
  dark height="48">
     <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
     <v-toolbar-title>Simple Hand Annotator</v-toolbar-title>
     <v-spacer></v-spacer>
     <v-btn-toggle v-model="canvasSize">
        <v-btn flat value="OutPutSize" class="text-none">
          <v-icon>mdi-image-size-select-large</v-icon>
          <span>OutPutSize</span>
        </v-btn>
        <v-btn flat value="FitToView" class="text-none">
          <v-icon>mdi-resize</v-icon>
          <span>FitToView</span>
        </v-btn>
     </v-btn-toggle>
  </v-toolbar>
</template>

<script>

  export default {
    name: 'annotate-header',
    data() {
      return {
        canvasSize: 'FitToView',
      };
    },
    watch: {
      canvasSize(newValue) {
        const payload = {
          FitToView: newValue === 'FitToView',
        };
        this.$store.commit('TOGGLEFITTOVIEW', payload);
      },
    },
  };

</script>

<style>
</style>
