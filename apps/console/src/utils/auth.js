import api from './api'
export default {
    isAuthenticated: false,
    onAuthFail: null,
    logout() {
        localStorage.setItem('token', '')
    },
    async checkAuthenticated() {
        try {
            this.isAuthenticated =
                (await api({
                    name: 'checkAuthenticated'
                })) || false
        } catch (err) {
            this.isAuthenticated = false
        }
        if (this.isAuthenticated === false) {
            this.onAuthFail && this.onAuthFail()
        }
    }
}