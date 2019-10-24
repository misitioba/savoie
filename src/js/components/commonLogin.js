import {
    default as stylesMixin,
    template as stylesTpl
} from '../mixins/stylesMixin'

Vue.component('common-login', {
    props: ['logo'],
    mixins: [stylesMixin],
    template: stylesTpl(`
        <div class="login_form" ref="root"" @keyup.esc="$emit('close')" tabindex="0">
            <div class="overlay">
                <button class="CloseButton" @click="$emit('close')">X</button>
                <div class="form">
                    <img v-show="!!logo" :src="logo" />
                    <label>Email</label>
                    <input v-model="form.email" />
                    <label>Mot de passe</label>
                    <input v-model="form.password" type="password" />
                    <div>
                        <label>Mémoriser les informations</label>
                        <input type="checkbox" v-model="remember" />
                    </div>
                    <div class="btn-group">
                        <button class="btn" @click="loginWithEmailAndPassword">Login</button>
                        <button class="btn" @click="createAccount">Create new account</button>
                    </div>
                    <div>
                    <a href="#" @click="restartUserPassword">
                    J'ai oublié mon mot de passe
                    </a>
                    </div>
                </div>

            </div>
        </div>
    `),
    methods: {
        validateForm() {
            if (!this.form.email) {
                alert('email requis/required/requerido')
                return false
            }
            if (!this.form.password) {
                alert('password requis/required/requerida')
                return false
            }
            return true
        },
        rememberCredentials() {
            if (this.remember) {
                window.localStorage.setItem(
                    'login',
                    btoa(
                        JSON.stringify({
                            ...this.form
                        })
                    )
                )
            }
        },
        async restartUserPassword() {
            if (!this.form.email) return alert('Email requis')
            if (
                window.confirm(
                    `Le mot de passe du compte ${
            this.form.email
          } sera réinitialisé, êtes-vous sûr?`
                )
            ) {
                await api.funql({
                    name: 'restartUserPassword',
                    args: [this.form.email]
                })
                alert(
                    `Si l'email est valide, le mot de passe a été envoyé à votre boîte aux lettres.`
                )
            }
        },
        async createAccount() {
            if (!this.validateForm()) return
            try {
                let user = await api.funql({
                        name: 'common_create_account',
                        args: [Object.assign({}, this.form)]
                    })
                    // this.$emit('logged', user)
                this.loginWithEmailAndPassword()
            } catch (err) {
                if (err === 'ALREADY_EXISTS') {
                    alert(
                        "L'email est déjà enregistré / The email is already registered / El correo electrónico ya está registrado."
                    )
                }
            }
        },
        async loginWithEmailAndPassword() {
            if (!this.validateForm()) return
            try {
                let user = await api.loginWithEmailAndPassword(
                    Object.assign({}, this.form)
                )
                this.rememberCredentials()
                this.$emit('logged', user)
            } catch (err) {
                if (err === 'INVALID_PASSWORD') {
                    alert("Erreur d'identification")
                }
            }
        },
        restoreCredentialsFromCache() {
            try {
                let _form = JSON.parse(atob(localStorage.getItem('login')))
                Object.assign(this.form, {
                    ..._form
                })
                this.remember = true
            } catch (err) {}
        }
    },
    async mounted() {
        this.restoreCredentialsFromCache()
    },
    data() {
        return {
            remember: false,
            form: {
                email: '',
                password: ''
            },
            styles: `
            .CloseButton{
                cursor:pointer;
                position: absolute;
                right: 25px;
                top: 10px;
                margin: 0px;
                border: 0px;
                padding: 10px 20px;
                font-weight: bold;
                font-size: 25px;
                background: #b5a075;
                color: white;
            }
               .overlay{
                   position:fixed;
                   top:0px;
                   width: calc(100vw);
                   height: calc(100vh);
                   background-color:rgba(255, 255, 255, 0.9);
               }
               .login_form input{
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
                max-height: 170px;
                max-width: 230px;
                margin: 0 auto;
               }
               .login_form .form{
                display: flex;
                flex-direction: column;
                max-width: 300px;
                margin: 0 auto;
                margin-top: 0px;
                background: #fff;
                margin-top: calc(50vh - 230px);
                padding: 50px 20px 50px 20px;
                border-radius: 5px;
               }
               .login_form button{
                margin-top: 30px;

                display: block;
                
                max-width: none;
               }

               .btn-group{
                display: flex;
                justify-content: center;
               }
               .btn-group button{
                   margin:5px;
               }
`
        }
    }
})