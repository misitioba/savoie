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
    async created() {
        /* let loggedUser = await api.getLoggedUser({})
            console.log('loggedUser', {
                loggedUser
            }) */
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
            if (window.onLogin) {
                window.onLogin()
            }
        },
        onLogout() {
            window.user = {
                id: null
            }
            if (window.onLogout) {
                window.onLogout()
            }
        }
    }
})