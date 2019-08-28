import {default as stylesMixin, template as stylesTpl} from '../mixins/stylesMixin'

Vue.component('common-login', {
    props: ['logo'],
    mixins:[stylesMixin],
    template: stylesTpl(`
        <div class="login_form" ref="root"" @keyup.esc="$emit('close')" tabindex="0">
            <div class="overlay">
                <div class="form">
                    <img v-show="!!logo" :src="logo" />
                    <label>Email</label>
                    <input v-model="form.email" />
                    <label>Mot de passe</label>
                    <input v-model="form.password" type="password" />
                    <div class="btn-group">
                        <button class="btn" @click="loginWithEmailAndPassword">Login</button>
                        <button class="btn" @click="createAccount">Create new account</button>
                    </div>
                </div>

            </div>
        </div>
    `),
    methods: {
        validateForm(){
            if(!this.form.email) {
                alert('email requis/required/requerido')
                return false
            }
            if(!this.form.password){
                alert('password requis/required/requerida')
                return false
            }
            return true
        },
        async createAccount(){
            if(!this.validateForm()) return
            try {
                let user = await api.funql(
                    {
                        name:'common_create_account',
                        args:[Object.assign({}, this.form)]
                    }
                )
                //this.$emit('logged', user)
                this.loginWithEmailAndPassword()
            } catch (err) {
                if (err === 'ALREADY_EXISTS') {
                    alert("L'email est déjà enregistré / The email is already registered / El correo electrónico ya está registrado.")
                }
            }
        },
        async loginWithEmailAndPassword() {
            if(!this.validateForm()) return
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