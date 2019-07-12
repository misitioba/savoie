Vue.component('login-form', {
    template: `
        <div class="login_form" ref="root"" @keyup.esc="$emit('close')" tabindex="0">
            <div class="overlay">
                <div class="form">
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
                let user = await api.loginWithEmailAndPassword(Object.assign({}, this.form))
                this.$emit('logged', user);
            } catch (err) {

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
                   background-color:rgba(0,0,0,.5)
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
               .form{
                    display: flex;
                    flex-direction: column;
                    max-width: 400px;
                    margin: 0 auto;
                    margin-top: 0px;
                    background: #daf3c7;
                    margin-top: calc(50vh - 200px);
                    padding: 50px 20px;
                    border-radius: 15px;
               }
`
        }
    }
})