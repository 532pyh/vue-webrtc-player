<template>
    <div style="text-align:center">
        <img alt="Vue logo" src="../assets/logo.png" height="50px">
        <div>
            <h4>基于WebRTC协议和H5元video开发的播放器</h4>
            <vueWebRTCPlayer ref="player" ip="172.16.15.95" port="1985" :src="this.src" :index="1" @volumechange="volumechange"></vueWebRTCPlayer>
            <input v-model="src" style="width:400px"/>
            <button @click="handlePlay">播放</button>
            <button @click="handlePause">暂停</button>
            <button @click="changeVolume">音量</button>
        </div>
    </div>
</template>
<script>
export default {
    name: "home",
    data() {
        return {
            visible: false,
            src: 'webrtc://112.5.154.242/live/2',
        }
    },
    methods: {
        handlePlay(){
            this.$refs.player.handlePlay()
        },
        handlePause(){
            this.$refs.player.pause()
        },
        changeVolume(){
            this.$refs.player.changeVolume(0)
        },
        volumechange(val){
            // console.log(val)
        }
    }
};
</script>
