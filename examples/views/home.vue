<template>
    <div style="text-align:center">
        <img alt="Vue logo" src="../assets/logo.png" height="50px">
        <div>
            <h4>基于WebRTC协议和H5元video开发的播放器</h4>
            <vueWebRTCPlayer ref="player" class="player" ip="172.16.15.95" port="1985" :src="this.src" :index="1" @playerHandle="playerHandle" ></vueWebRTCPlayer>
            <input v-model="src" style="width:300px;margin:10px 0"/></br>
            <button @click="handlePlay" style="margin-right:10px">播放</button>
            <button @click="handlePause">暂停</button>
        </div>
    </div>
</template>
<style lang="less" scoped>
.player:hover{
    border: 1px solid #1fc2dc;
}
</style>
<script>
export default {
    name: "home",
    data() {
        return {
            visible: false,
            src: 'webrtc://172.16.15.95/live/2',
        }
    },
    methods: {
        handlePlay(){
            this.$refs.player.handlePlay()
        },
        handlePause(){
            this.$refs.player.handlePause()
        },
        playerHandle(data){
            console.log(data)
        }
    }
};
</script>
