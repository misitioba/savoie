import './components/commonHeaderInternal'
import './components/commonLogin'


new Vue({
    el: '.appTop',
    name: 'commonHeader',
    data() {
        return {
            modal: ''
        }
    },
    computed: {
        showLogin() {
            return this.modal === 'login'
        }
    },
    methods: {
        onUser(user) {
            window.user = user
        },
        login() {
            this.modal = 'login'
        },
        closeModal() {
            console.log('closeModal')
            this.modal = ''
        },
        onLoginSuccess(user) {
            this.closeModal()
            this.$refs.header.$emit('onLoginSuccess', user)
            window.user = {
                id: user.id
            }
        },
        onLogout() {
            window.user = {
                id: null
            }
        }
    }
})