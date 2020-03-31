<template>
    <div :id="'playerWrap'+index" class="player-wrap" :style="{width:width+'px',height:height+'px'}" @mouseenter="controls=true"  @mouseleave="controls=false" @click="listenerPlayerHandle('select')">
        <video :id="'player'+index" class="player" ref="player" autoplay width="100%" height="100%" :poster="poster">
        </video>
        <div class="player-loading" v-show="loading">加载</div>
        <div class="player-controls" v-show="controls || playState=='pasue'" :style="{background:controlsBackground}">
            <i title="播放" class="iconfont left-btn" v-show="playState=='pasue'" @click="handlePlay">&#xe622;</i>
            <i title="暂停" class="iconfont left-btn" v-show="playState=='play'" @click="handlePause">&#xe6a8;</i>
            <i title="禁音" class="iconfont left-btn" v-show="volState=='open'" @click="handleCloseVol">&#xe602;</i>
            <i title="开启声音" class="iconfont left-btn" v-show="volState=='close'" @click="handleOpenVol">&#xe6cb;</i>
            <i title="截屏" class="iconfont left-btn" v-show="printScreen" @click="handlePrintScreen">&#xe649;</i>
            <i title="全屏" class="iconfont right-btn" v-show="screenState=='normal'" @click="handleFullScreen">&#xe663;</i>
            <i title="退出全屏" class="iconfont right-btn" v-show="screenState=='full'" @click="handleExitFullscreen">&#xe60a;</i>
        </div>
        <canvas :id="'canvas'+index" style="display:none"></canvas>
    </div>
</template>
<style lang="less" scoped>
@import "./css/index.less";
</style>
<script src="./js/index.js"></script>
