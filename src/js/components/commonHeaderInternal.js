import stylesMixin from '../mixins/stylesMixin'
Vue.component('common-header', {
    mixins: [stylesMixin],
    props: ['logo'],
    template: `
<div ref="scope">
        <div class="common_header" ref="root">
            <div class="right">
                <div class="toolbar" @click="toggleToolbar">
                    <div class="user_icon">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="text" >
                        <span v-html="text"></span>
                    </div>
                    <div class="icon">
                        <i class="fas fa-angle-down"></i>
                    </div>
                </div>
                <div class="toolbar_menu" v-show="toolbarCollapsed">
                    <a href="#" @click="logout">Déconnecter</a>
                </div>
            </div>
            
        </div>

        <div class="logoWrapper" v-show="!isLogged&&!!logo">
        <img class="logo" :src="logo" v-show="!isLogged&&!!logo" ref="logo"/>
        </div>
        

        </div>
    `,
    destroyed() {
        this.unbindCollapseOnClickOut()
    },
    methods: {
        bindCollapseOnClickOut() {
            var self = this
            this.unbindCollapseOnClickOut()
            this.clickOutBinding = function() {
                self.toolbarCollapsed = false
            }
            $(document).on('click', this.clickOutBinding)
        },
        unbindCollapseOnClickOut() {
            if (this.clickOutBinding) {
                $(document).off('click', this.clickOutBinding)
            }
        },
        async logout() {
            await api.logout()
            this.isLogged = false
            this.user = {}
            this.toolbarCollapsed = false
            this.$emit('logout')
        },
        toggleToolbar(e) {
            if (!this.isLogged) {
                return this.$emit('on_login')
            }
            this.toolbarCollapsed = !this.isLogged ? false : !this.toolbarCollapsed
            e.stopPropagation()
        }
    },
    computed: {
        text() {
            if (this.isLogged) {
                return this.user.email.split('@')[0]
            } else {
                return `Se connecter`
            }
        }
    },
    async mounted() {
        setTimeout(() => {
            this.$refs.logo.style.display = 'block'
        }, 1000)
        try {
            this.user = await api.getLoggedUser()
            this.isLogged = !!this.user
            this.$emit('user', this.user)
        } catch (err) {
            console.log('guest')
        }

        this.$on('onLoginSuccess', user => {
            Object.assign(this.user, user)
            this.isLogged = true
        })
        this.bindCollapseOnClickOut()
    },
    data() {
        return {
            clickOutBinding: null,
            user: {},
            isLogged: false,
            toolbarCollapsed: false,
            styles: `
            .logoWrapper{
                height: calc(100vh - 100px);
            }
                .logo{
                    width: 100%;
                    height: calc(100vh - 100px);
                    display:none;
                }
                .common_header{
                    background-color: transparent;
                    min-height: 100px;
                    display:flex;
                    justify-content: flex-end;
                }
                .common_header h1{
                    font-size: 8px;
                }
                .common_header .right{
                    display: flex;
                    align-self: center;
                    justify-self: center;
                }
                .common_header .toolbar:hover{
                    background: #d9c3c0;
                }
                .common_header .toolbar{
                    display: grid;
                    grid-template-columns: 1fr 50% 1fr;
                    grid-template-areas: 'el el el';
                    align-self: center;
                    justify-self: flex-end;
                    background: #e4dccc;
                    padding: 15px;
border-radius: 5px 0px 0px 0px;
                }
                .common_header .toolbar_menu{
                    position: absolute;
                    height: -moz-max-content;
                    width: -moz-available;
                    top: 73px;
background: #f8e8e8;
padding: 0px 0px;
                }
                .common_header .toolbar_menu a{
                    color:black;
                    font-size: 12px;
                    text-decoration:none;
                    padding: 20px;
                    display: block;
                    
                }
                .common_header .toolbar_menu a:hover{
                    background-color:#dfd9d8;
                }
                .common_header .toolbar:hover{
                    cursor:pointer;
                }
                .common_header .user_icon, .icon{
                    display:flex;
                    justify-content:center;
                    align-items:center;
                }
                .common_header .text{
                    font-size: 12px;
                    white-space: nowrap;
                    min-width: 115px;
                    
                }
`
        }
    }
})