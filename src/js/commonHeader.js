import './components/commonHeaderInternal'
import './components/commonLogin'
import './components/profileDetails'
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
    mounted() {},
    methods: {
        onUser(user) {
            if (!user) {
                this.login()
            } else {
                window.user = user
            }
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
            this.$refs.header.setUser(user)
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

            this.login()
        }
    }
})