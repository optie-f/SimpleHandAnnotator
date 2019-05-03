<template>
  <v-toolbar app class="elevation-0" dark height="48">
     <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
     <v-toolbar-title>Simple Hand Annotator</v-toolbar-title>
     <v-spacer></v-spacer>
     <v-btn-toggle v-model="editMode">
        <v-btn flat value="editPoint" class="text-none">
          <v-icon>mdi-pin</v-icon>
          <span>Edit Point</span>
        </v-btn>
        <v-btn flat value="movePoint" class="text-none">
          <v-icon>mdi-cursor-move</v-icon>
          <span>Move Points</span>
        </v-btn>
        <v-btn flat value="moveImage" class="text-none">
          <v-icon>mdi-crop-free</v-icon>
          <span>Move Image</span>
        </v-btn>
     </v-btn-toggle>
  </v-toolbar>
</template>

<script>

  export default {
    name: 'annotate-header',
    data() {
      return {
        editMode: 'editPoint',
      };
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
