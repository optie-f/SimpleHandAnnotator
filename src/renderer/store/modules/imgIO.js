// KeyPointは左上原点の相対位置で持っておく
const defaultKeyPoints = {
  thumb: [
    0.7, 0.5,
    0.75, 0.6,
  ],
  finger1: [
    0.6, 0.7,
    0.6, 0.8,
    0.6, 0.8,
  ],
  finger2: [
    0.5, 0.7,
    0.5, 0.8,
    0.5, 0.9,
  ],
  finger3: [
    0.4, 0.7,
    0.4, 0.8,
    0.4, 0.8,
  ],
  finger4: [
    0.3, 0.6,
    0.3, 0.68,
    0.3, 0.75,
  ],
  palm: [
    0.5, 0.3,
  ],
};

const state = {
  ptr: 0,
  selectedFiles: [],
  viewHeight: 128,
  viewWidth: 128,
  outputWidth: 128,
  outputHeight: 128,
  FitToView: true,
  keyPointsArray: [],
};

const mutations = {
  NEXTIMG(state) {
    state.ptr += 1;
    state.ptr %= state.selectedFiles.length;
    console.log('next img');
  },
  PREVIMG(state) {
    if (state.ptr === 0) {
      state.ptr = state.selectedFiles.length - 1;
    } else {
      state.ptr -= 1;
      state.ptr %= state.selectedFiles.length;
    }
  },
  ADDIMGFILE(state, payload) {
    state.selectedFiles.push(payload.file);
    state.keyPointsArray.push(JSON.parse(JSON.stringify(defaultKeyPoints)));
  },
  SETCANVASCONFIG(state, payload) {
    state.outputWidth = payload.outputWidth;
    state.outputHeight = payload.outputHeight;
    state.FitToView = payload.FitToView;
  },
  SETVIEWCONTAINERSIZE(state, payload) {
    state.viewHeight = payload.viewHeight;
    state.viewWidth = payload.viewWidth;
  },
  SETKEYPOINTS(state, payload) {
    console.log('keypoint set', payload);
    state.keyPointsArray[state.ptr][payload.cls][payload.index * 2] = payload.x;
    state.keyPointsArray[state.ptr][payload.cls][(payload.index * 2) + 1] = payload.y;
  },
};

const actions = {
  imread({ commit }, fileList) {
    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList[i];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const payload = { file };
        commit('ADDIMGFILE', payload);
      }
    }
  },
};

const getters = {
  ptr(state) {
    return state.ptr;
  },
  currentImg(state) {
    if (state.selectedFiles.length === 0) return '';
    return state.selectedFiles[state.ptr];
  },
  currentKeyPoints(state) {
    if (state.keyPointsArray.length === 0) return false;
    console.log('currentKeyPoints', state.keyPointsArray[state.ptr]);
    return state.keyPointsArray[state.ptr];
  },
  classes(state, getters) {
    return Object.keys(getters.currentKeyPoints);
  },
  numImages(state) {
    return state.selectedFiles.length;
  },
  canvasSize(state) {
    const viewHW = state.viewHeight / state.viewWidth;
    const outHW = state.outputHeight / state.outputWidth;
    if (state.FitToView) {
      if (viewHW <= outHW) { // output より view の方が横長
        return { // Full Height
          canvasHeight: state.viewHeight,
          canvasWidth: state.viewHeight * (1 / outHW),
        };
      } // else output の方が横長
      return { // Full Width
        canvasWidth: state.viewWidth,
        canvasHeight: state.viewWidth * outHW,
      };
    }
    return {
      canvasWidth: state.outputWidth,
      canvasHeight: state.outputHeight,
    };
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
