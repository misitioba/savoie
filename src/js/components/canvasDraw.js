import {
    default as stylesMixin,
    template as styleMixinTmpl
} from '../mixins/stylesMixin'
Vue.component('canvas-draw', {
    mixins: [stylesMixin],
    template: styleMixinTmpl(`<div ref="root" class="cmp_cd">

    <canvas ref="canvas" class="cmp_cd__canvas"></canvas>

    </div>
    `),
    data() {
        return {
            styles: `
            .cmp_cd__canvas{
                position: fixed;
                min-width: calc(100vw);
                height: calc(100vh);
                top: 0px;
                left: 0px;
                z-index:100;
                cursor: pointer;
            }
            `
        }
    },
    mounted() {
        // create canvas element and append it to document body
        var canvas = this.$refs.canvas

        // some hotfixes... ( ≖_≖)
        document.body.style.margin = 0
        canvas.style.position = 'fixed'

        // get canvas 2D context and set him correct size
        var ctx = canvas.getContext('2d')
        resize()

        this.$on('clear', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        })

        // last known position
        var pos = { x: 0, y: 0 }

        window.addEventListener('resize', resize)
        document.addEventListener('mousemove', draw)
        document.addEventListener('mousedown', setPosition)
        document.addEventListener('mouseenter', setPosition)

        // new position from mouse event
        function setPosition(e) {
            pos.x = e.clientX
            pos.y = e.clientY
        }

        // resize canvas
        function resize() {
            ctx.canvas.width = window.innerWidth
            ctx.canvas.height = window.innerHeight
        }

        function draw(e) {
            // mouse left button must be pressed
            if (e.buttons !== 1) return

            ctx.beginPath() // begin

            ctx.lineWidth = 5
            ctx.lineCap = 'round'
            ctx.strokeStyle = '#c0392b'

            ctx.moveTo(pos.x, pos.y) // from
            setPosition(e)
            ctx.lineTo(pos.x, pos.y) // to

            ctx.stroke() // draw it!
        }
    }
})