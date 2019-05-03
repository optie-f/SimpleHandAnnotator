<template>
  <v-footer app color="grey lighten-3" height="100">
    <v-container grid-list-xl fluid>
        <v-form>
      <v-layout  wrap  justify-center row fill-height>
        <v-flex xs2>
          <v-switch
              v-model="canvasConfig.FitToView"
              label="FitToView"
            ></v-switch>
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
        <v-flex xs2>
          <v-btn  @click="save" class="text-none" color="success">
            Save (s)
          </v-btn>
        </v-flex>
      </v-layout>
      </v-form>
    </v-container>
  </v-footer>
</template>

<script>

  export default {
    name: 'annotate-footer',
    data() {
      return {
        canvasConfig: {
          outputWidth: 128,
          outputHeight: 128,
          FitToView: true,
        },
      };
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
      save() {
        alert('save');
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
