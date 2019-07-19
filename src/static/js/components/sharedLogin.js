Vue.component('shared-login', {
    props: ['logo'],
    template: `
        <div class="login_form" ref="root"" @keyup.esc="$emit('close')" tabindex="0">
            <div class="overlay">
                <div class="form">
                    <img v-show="!!logo" :src="logo" />
                    <label>Email</label>
                    <input v-model="form.email" />
                    <label>Password</label>
                    <input v-model="form.password" type="password" />
                    <button class="btn" @click="loginWithEmailAndPassword">Login</button>
                </div>

            </div>
        </div>
    `,
    methods: {
        async loginWithEmailAndPassword() {
            try {
                let user = await api.loginWithEmailAndPassword(
                    Object.assign({}, this.form)
                )
                this.$emit('logged', user)
            } catch (err) {
                if (err === 'INVALID_PASSWORD') {
                    alert("Erreur d'identification")
                }
            }
        }
    },
    async mounted() {
        let styles = document.createElement('style')
        styles.setAttribute('scoped', '')
        styles.innerHTML = this.styles
        this.$refs.root.appendChild(styles)
    },
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            styles: `
               .overlay{
                   position:fixed;
                   top:0px;
                   width: calc(100vw);
                   height: calc(100vh);
                   background-color:rgba(255, 255, 255, 0.5);
               }
               input{
                    border:0px;
                    margin-top: 5px;
                    margin-bottom: 15px;
                    border-radius: 3px;
                    background-color: #ddcde7;
                    font-size: 14px;
                    line-height: 30px;
               }
               label:{

               }
               .login_form img{
                    max-height: 140px;
               }
               .login_form .form{
                display: flex;
                flex-direction: column;
                max-width: 300px;
                margin: 0 auto;
                margin-top: 0px;
                background: #fff;
                margin-top: calc(50vh - 230px);
                padding: 15px 20px 70px 20px;
                border-radius: 5px;
               }
               .login_form button{
                margin-top: 30px;

                display: block;
                
                max-width: none;
               }
`
        }
    }
})