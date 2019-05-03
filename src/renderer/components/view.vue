<template>
  <v-container fluid grid-list-xl>
    <konva-canvas id="canvas"></konva-canvas>
    <control-images></control-images>
  </v-container>
</template>

<script>
  import konvaCanvas from './konva-canvas';
  import controlImages from './control-images';

  export default {
    name: 'annotateView',
    components: {
      konvaCanvas,
      controlImages,
    },
  };
</script>

<style>
  #canvas  {
    /* height: 80%; */
    /* border: solid 1px #DCDFE6;
    background-color: #BDBDBD; */
    /* text-align: center; */
  }
</style>
