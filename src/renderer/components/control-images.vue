<template>
    <v-layout align-center justify-space-between row fill-height>
      <v-flex xs3>
        <v-btn flat class="text-none"  @click="prev">
          <v-icon large left>mdi-chevron-left</v-icon>
           <span>(p)</span>
        </v-btn>
      </v-flex>
      <v-flex xs3 align-self-center class="pagenum">
        {{ adjustedCurrentPtr }} / {{ numImages }}
      </v-flex>
      <v-flex xs3>
        <v-btn flat class="text-none" @click="next" >
           <span>(n)</span>
          <v-icon large right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'control-images',
    computed: {
      ...mapGetters(['numImages', 'ptr']),
      adjustedCurrentPtr() {
        return this.ptr + Number(this.numImages > 0);
      },
    },
    methods: {
      next() {
        if (this.numImages > 0) {
          this.$store.commit('NEXTIMG');
        }
      },
      prev() {
        if (this.numImages > 0) {
          this.$store.commit('PREVIMG');
        }
      },
    },
    mounted() {
      this.keydownEvent = (e) => {
        if (e.key === 'n' || e.key === 'N') {
          this.next();
        } else if (e.key === 'p' || e.key === 'P') {
          this.prev();
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
  .pagenum {
    text-align: center;
    font-family: "Helvetica Neue", sans-serif;
    font-size: 16px;
    color: #303133;
  }
</style>
