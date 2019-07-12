Vue.component('panel', {
    template: `
        <div class="panel" ref="root">
            <div class="right">
                <div class="toolbar" @click="toggleToolbar">
                    <div class="user_icon">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="text" v-html="text">
                        
                    </div>
                    <div class="icon">
                        <i class="fas fa-angle-down"></i>
                    </div>
                </div>
                <div class="toolbar_menu" v-show="toolbarCollapsed">
                    <a href="#" @click="logout">Logout</a>
                </div>
            </div>
            
        </div>
    `,
    methods: {
        async logout() {
            await api.logout();
            this.isLogged = false;
            this.user = {}
            this.toolbarCollapsed = false;
            this.$emit('logout')
        },
        toggleToolbar() {
            if (!this.isLogged) {
                return this.$emit('on_login')
            }
            this.toolbarCollapsed = !this.isLogged ? false : !this.toolbarCollapsed;
        }
    },
    computed: {
        text() {
            if (this.isLogged) {
                return this.user.email.split('@')[0];
            } else {
                return `Se connecter`
            }
        }
    },
    async mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
        try {
            this.user = await api.getLoggedUser()
            this.isLogged = !!this.user
            this.$emit('user', this.user)
        } catch (err) {
            console.log('guest')
        }

        this.$on('onLoginSuccess', (user) => {
            Object.assign(this.user, user)
            this.isLogged = true
        })
    },
    data() {
        return {
            user: {},
            isLogged: false,
            toolbarCollapsed: false,
            styles: `
                .panel{
                    background-color: #fbd8d8;
                    min-height: 100px;
                    display:flex;
                    justify-content: flex-end;
                }
                .panel h1{
                    font-size: 8px;
                }
                .right{
                    display: flex;
                    align-self: center;
                    justify-self: center;
                }
                .toolbar{
                    display: grid;
                    grid-template-columns: 1fr 50% 1fr;
                    grid-template-areas: 'el el el';
                    align-self: center;
                    justify-self: flex-end;
                    background: #f8e8e8;
                    padding: 20px;
                }
                .toolbar_menu{
                    position: absolute;
                    height: -moz-max-content;
                    width: -moz-available;
                    top: 75px;
                    background: #e6e6e6;
                    padding: 20px 0px;
                }
                .toolbar_menu a{
                    color:black;
                    font-size: 12px;
                    text-decoration:none;
                    padding: 20px;
                    display: block;
                    
                }
                .toolbar:hover{
                    cursor:pointer;
                }
                .user_icon, .icon{
                    display:flex;
                    justify-content:center;
                    align-items:center;
                }
                .text{
                    font-size: 12px;
                    white-space: nowrap;
                    min-width: 115px;
                }
`
        }
    }
})

new Vue({
    el: '.appTop',
    name: 'backoffice',
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
            window.user = user;
        },
        login() {
            this.modal = 'login'
        },
        closeModal() {
            console.log('closeModal')
            this.modal = ''
        },
        onLoginSuccess(user) {
            this.closeModal();
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