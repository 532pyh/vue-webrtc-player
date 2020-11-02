import axios from 'axios';
// import './adapter-7.4.0.min.js'
export default {
    name: 'vueWebRTCPlayer',
    props: {
        width: {//播放器宽度
            type: String,
            default: '300px'
        },
        height: {//播放器高度
            type: String,
            default: '225px'
        },
        poster: {//播放器封面
            type: String,
            default: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3193283665,3983976966&fm=26&gp=0.jpg'
        },
        src: {//WebRTC流地址
            type: String,
            required: true
        },
        ip: {//WebRTC视频服务器地址
            type: String,
            required: true
        },
        port: {//WebRTC端口
            type: String,
            required: true
        },
        index: {//播放器标志，例如序号
            type: [String, Number],
            default: ''
        },
        controlsBackground: {//控制栏背景
            type: String,
            default: '#1fc2dc',
        }
    },
    data() {
        return {
            loading: false,
            url: this.src,//播放地址
            link: null,//WebRTC连接实例
            controls: false,//显示控制栏
            playState: 'pasue',//播放状态 play：播放，pasue：暂停
            volState: 'open',//音量状态 open：开，close：禁音
            screenState: 'normal',//屏幕状态 normal：不全屏，full：全屏
            printScreen: false,//显示截屏功能
        }
    },
    watch: {
        src(val) {
            this.url = val;
        }
    },
    mounted() {
        document.getElementById(`player${this.index}`).addEventListener('playing', this.listenerProgress);
    },
    beforeDestroy() {
        if (this.link) {
            this.link.close();//如果WebRTC连接已经存在，先销毁
        }
        document.getElementById(`player${this.index}`).removeEventListener('playing', this.listenerProgress);
    },
    methods: {
        listenerProgress() {
            console.log(1)
            this.loading = false;
        },
        listenerPlayerHandle(type) {//监听播放器操作，并暴露
            const data = {
                type: type,
                index: this.index
            }
            this.$emit('playerHandle', data)
        },
        setUrl(src) {
            this.url = src;
        },
        setVol(num) {
            if (num > 1) {
                this.$refs.player.volume = 1;
            } else if (num < 0) {
                this.$refs.player.volume = 0;
            } else {
                this.$refs.player.volume = num;
            }
        },
        handlePlay() {//开始播放WebRTC流
            if (this.link) {
                this.link.close();//如果WebRTC连接已经存在，先销毁
            }
            this.link = new RTCPeerConnection(); //创建WebRTC连接
            const _this = this;

            new Promise(function (resolve, reject) {
                _this.link.createOffer( //启动WebRTC连接
                    function (offer) {
                        resolve(offer);
                    },
                    function (reason) {
                        reject(reason);
                    }, {
                    mandatory: {
                        OfferToReceiveAudio: true, //允许传输音频流
                        OfferToReceiveVideo: true //允许传输视频流
                    }
                }
                );
            }).then(function (offer) {
                return _this.link.setLocalDescription(offer).then(function () {
                    return offer;
                });
            }).then(function (offer) {
                return new Promise(function (resolve, reject) {
                    const apiUrl = window.location.protocol + '//' + _this.ip + ':' + _this.port + '/rtc/v1/play/';
                    var data = {
                        api: apiUrl,
                        streamurl: _this.url,
                        clientip: null,
                        sdp: offer.sdp
                    };
                    axios({
                        method: 'post',
                        url: apiUrl,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: data
                    }).then(res => {
                        resolve(res.data.sdp);
                    }).catch(err => {
                        reject(err)
                    })
                });
            }).then(function (answer) {
                return _this.link.setRemoteDescription(new RTCSessionDescription({
                    type: 'answer',
                    sdp: answer
                }));
            }).catch(function (reason) {
                throw reason;
            });
            this.link.ontrack = function (event) { //创建WebRTC连接成功后
                _this.$refs.player.srcObject = event.streams[0];
                _this.playState = 'play';
                _this.printScreen = true;
                _this.listenerPlayerHandle('play');
                _this.loading = true;
            };
        },
        handlePause() {//销毁WebRTC流
            this.$refs.player.pause();
            if (this.link) {
                this.link.close();//如果WebRTC连接已经存在，先销毁
                this.link = null;
                this.playState = 'pasue';
                this.printScreen = false;
            }
            this.listenerPlayerHandle('pasue');
        },
        handleCloseVol() {//关闭声音
            this.volState = 'close';
            this.$refs.player.volume = 0;
            this.listenerPlayerHandle('closeVol');
        },
        handleOpenVol() {//开启声音
            this.volState = 'open';
            this.$refs.player.volume = 1;
            this.listenerPlayerHandle('openVol');
        },
        handleFullScreen() {//全屏
            const el = document.getElementById(`playerWrap${this.index}`);
            if (el.requestFullscreen) {
                el.requestFullscreen()
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen()
            } else if (el.webkitRequestFullScreen) {
                el.webkitRequestFullScreen()
            }
            this.screenState = 'full';
            this.listenerPlayerHandle('fullScreen');
        },
        handleExitFullscreen() {//退出全屏
            let el = document;
            if (el.exitFullscreen) {
                el.exitFullscreen();
            } else if (el.mozCancelFullScreen) {
                el.mozCancelFullScreen();
            } else if (el.webkitCancelFullScreen) {
                el.webkitCancelFullScreen();
            }
            this.screenState = 'normal';
            this.listenerPlayerHandle('exitFullscreen');
        },
        handlePrintScreen() {
            this.controls = false;
            const player = document.getElementById(`player${this.index}`);
            const canvas = document.getElementById(`canvas${this.index}`);
            canvas.width = this.width * 2;
            canvas.height = this.height * 2;
            canvas.style.width = this.width + "px";
            canvas.style.height = this.height + "px";
            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);
            ctx.drawImage(player, 0, 0, this.width, this.height);  // 将player中的数据绘制到canvas里
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const date = new Date(); //获取一个时间对象
            const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
            const timg = date.getFullYear() + '年' + month + date.getDate() + '日' + date.getHours() + '时' + date.getMinutes() + '分' + date.getSeconds() + '秒'
            const filename = timg + '.png';
            // 创建a标签并为其添加属性
            let downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', image);
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink); // Required for FF
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    },
}