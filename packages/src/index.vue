<template>
    <div class="player-wrap">
        {{link}}
        <video id="WebRTCPlayer" ref="player" autoplay controls :width="width" :height="height" :poster="poster" class="player">
        </video>
    </div>
</template>
<style lang="less" scoped>
@import "./css/index.less";
</style>
<script src="./js/index.js"></script>
