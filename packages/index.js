import vueWebRTCPlayer from './src/index.vue';
vueWebRTCPlayer.install = function(Vue) {
    Vue.component(vueWebRTCPlayer.name, vueWebRTCPlayer);
};
export default vueWebRTCPlayer;
