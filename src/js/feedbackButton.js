import {
    default as stylesMixin,
    template as styleMixinTmpl
} from './mixins/stylesMixin'
import './components/canvasDraw'
import html2canvas from 'html2canvas';
(async () => {
    //init()
    window.createFeedBackButton = function ({ module_id }) {
        init(module_id)
    }

    function init(module_id) {
        if (!document.querySelector('.feedbackButtonWrapper')) {
            let wrapper = document.createElement('div')
            wrapper.className = 'feedbackButtonWrapper'
            document.body.appendChild(wrapper)
        }
        new Vue({
            mixins: [stylesMixin],
            el: '.feedbackButtonWrapper',
            template: styleMixinTmpl(`<div ref="root" class="cmp_fb" v-show="visible">
                <canvas-draw ref="canvas" v-show="!showButton"></canvas-draw>
                <button @click="openFeedbackDialog" v-show="showButton" class="cmp_fb__btn">Feedback</button>
                <div class="cmp_fb__dialog" v-show="!showButton">
                    <h3>Feedback</h3>
                    <p class="subtitle">Envoyez-nous des bugs et des améliorations. Vous pouvez dessiner des lignes avec la souris.</p>
                    <p class="subtitle">English: Send us improvements/bugs. You can draw figures with the mouse.</p>
                    <label class="cmp_fb__dialog__label">Title</label>
                    <input class="cmp_fb__dialog__input" placeholder="I found a bug" v-model="form.title"/>
                    <label class="cmp_fb__dialog__label">Message</label>
                    <textarea class="cmp_fb__dialog__textarea" placeholder="When I click the refresh button, nothings happen" v-model="form.message">
                    </textarea>
                    <div class="ButtonGroup">
                        <button class="btn cmp_fb__dialog__send_btn" @click="sendFeedback">Send</button>
                        <button class="btn cmp_fb__dialog__send_btn" @click="cancel">Cancel</button>
                    </div>
                </div>
            </div>`),
            name: 'feedbackButton',
            data() {
                return {
                    visible: true,
                    styles: `
                    .ButtonGroup{
                        display:flex;
                        margin-top: 10px;
                    }
                    .ButtonGroup button{
                        
                        margin-right:5px;
                    }
                    h3{
                        margin:0px;
                    }
                    .subtitle{
                        margin:10px 0px;
                    }
                    .cmp_fb{
                        color:white;
                        /*position: fixed;
                        min-width: calc(100vw);
                        height: calc(100vh);
                        top: 0px;
                        left: 0px;*/
                        
                    }
                    .cmp_fb__btn{
                        z-index: 101;
                        right: 20px;
                        bottom: 5px;
                        position: fixed;
                        background-color: #1dabe7;
                        width: 80px;
                        height: 30px;
                        cursor: pointer;
                        border: 0px;
                        color: #fff;
                    }
                    .cmp_fb__btn:hover{
                        background-color: darkslateblue;
                    }
                    .cmp_fb__dialog{
                        font-family:GT Eesti Display, "Helvetica Neue", Helvetica, sans-serif;
                        z-index:101;
                        position: fixed;

                        bottom: 5px;
                        
                        right: 20px;
                        
                        display: flex;
                        
                        flex-direction: column;
                        background: olivedrab;

padding: 20px;

border-radius: 5px;
max-width: 350px;
                    }
                   
                    .cmp_fb__dialog__input{

                    }
                    .cmp_fb__dialog__label{
margin-top:10px;
                    }
                    .cmp_fb__dialog__textarea{
                        min-width: 280px;

                        min-height: 150px;
                    }
                    .cmp_fb__dialog__send_btn{}
                    .cmp_fb__dialog__send_btn:hover{}
                    `,
                    showButton: true,
                    form: {
                        title: '',
                        message: ''
                    },
                    resizeInterval: null,
                    escapeBinding: (e) => {
                        if (e.which == 27) {
                            this.cancel()
                        }

                    }
                }
            },
            computed: {},
            methods: {
                cancel() {
                    this.showButton = true;
                    this.$refs.canvas.$emit('clear')
                },
                openFeedbackDialog() {
                    this.showButton = false
                },
                sendFeedback() {
                    html2canvas(document.body).then(canvas => {
                        var uri = canvas.toDataURL('image/jpg')
                        let date = require('moment-timezone')()
                            .tz('Europe/Paris')
                            .format('DD-MM-YYYY-[a]-HH-mm')

                        api.funql({
                            name: 'saveFeedback',
                            args: Object.assign({}, this.form, {
                                module_id
                            }),
                            multipart: {
                                image: dataURItoBlob(uri)
                            }
                        })

                        this.form.title = ''
                        this.form.message = ''
                        this.$refs.canvas.$emit('clear')
                        this.showButton = true
                        alert(`Merci pour votre contribution`)
                        // downloadURI(uri, `feedback-image-${date}`)
                    })

                    function dataURItoBlob(dataURI) {
                        // convert base64/URLEncoded data component to raw binary data held in a string
                        var byteString
                        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                            byteString = atob(dataURI.split(',')[1])
                        } else byteString = unescape(dataURI.split(',')[1])

                        // separate out the mime component
                        var mimeString = dataURI
                            .split(',')[0]
                            .split(':')[1]
                            .split(';')[0]

                        // write the bytes of the string to a typed array
                        var ia = new Uint8Array(byteString.length)
                        for (var i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i)
                        }

                        return new Blob([ia], { type: mimeString })
                    }

                    function downloadURI(uri, name) {
                        var link = document.createElement('a')
                        link.download = name
                        link.href = uri
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    }
                }
            },
            destroyed() {
                clearInterval(this.resizeInterval)
                $('window, body').off('keyup', this.escapeBinding);
            },
            mounted() {
                $('window, body').on('keyup', this.escapeBinding);
                this.resizeInterval = setInterval(() => {
                    if (window.innerWidth > 768) {
                        this.visible = true
                    } else {
                        this.visible = false
                    }
                }, 1000)
                console.log('feebackbutton mounted')
            }
        })
    }
})()