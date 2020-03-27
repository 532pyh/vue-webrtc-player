import axios from 'axios';
export default {
    name: 'vueWebRTCPlayer',
    props: {
        poster: {//播放器封面
            type: String,
            default: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585217895993&di=03544b02eba531590aec03edd2bdf883&imgtype=0&src=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20190807%2F13%2F1565155717-oeNKzkdHcS.jpg'
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
        width: {//播放器宽度
            type: String,
            default: '300'
        },
        height: {//播放器高度
            type: String,
            default: '225'
        },
        index: {//播放器标志，例如序号
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            link: null,//WebRTC连接实例
        }
    },
    watch: {
    },
    mounted() {
        document.getElementById("WebRTCPlayer").addEventListener('play', this.listenerPlay);
        document.getElementById("WebRTCPlayer").addEventListener('pause', this.handlePause);
        document.getElementById("WebRTCPlayer").addEventListener('volumechange', this.listenerVolume);
    },
    beforeDestroy() {
        if (this.link) {
            this.link.close();//如果WebRTC连接已经存在，先销毁
        }
        document.getElementById("WebRTCPlayer").removeEventListener('play', this.listenerPlay);
        document.getElementById("WebRTCPlayer").removeEventListener('pause', this.handlePause);
        document.getElementById("WebRTCPlayer").addEventListener('volumechange', this.listenerVolume);
    },
    methods: {
        //监听播放器的动作
        listenerVolume(val) {//监听音量调节
            let data = {
                type: 'volumechange',//播放器的动作
                val: this.$refs.player.volume,//播放器的动作返回值
                index: this.index,//播放器的标志
            }
            this.$emit('volumechange', data);
        },
        listenerPlay() {
            if (!this.link) {
                this.handlePlay()
            }
            let data = {
                type: 'play',//播放器的动作
                index: this.index,//播放器的标志
            }
            this.$emit('play', data);
        },
        listenerPause() {
            if (this.link) {
                this.link.close();//如果WebRTC连接已经存在，先销毁
                this.link = null;
            }
            let data = {
                type: 'play',//播放器的动作
                index: this.index,//播放器的标志
            }
            this.$emit('pasue', data);
        },
        handlePlayListener() {//监听播放器播放动作
            if (!this.link) {
                this.handlePlay()
            }
        },

        play() {//播放器本身的播放
            this.$refs.player.play();
        },
        pause() {//播放器本身的暂停
            this.$refs.player.pause();
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
                        streamurl: _this.src,
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
                        console.log(res)
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
            };
        },
        handlePause() {//销毁WebRTC流
            console.log('销毁')
            if (this.link) {
                this.link.close();//如果WebRTC连接已经存在，先销毁
                this.link = null;
            }
        }
    },
}