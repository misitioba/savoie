Vue.component('profile-details', {
    props: [],
    template: `
        <div class="profile_details" ref="root"" @keyup.esc="$emit('close')" tabindex="0">
            <div class="overlay">
                <div class="form">
                    <label>Mot de passe </label>
                    <p class="pdf__quote">(Changement de mot de passe)</p>
                    <input v-model="form.password" type="password" />
                    <button class="btn" @click="saveChanges">Save changes</button>
                </div>

            </div>
        </div>
    `,
    methods: {
        async saveChanges() {
            if (this.form.password) {
                await api.funql({
                    name: 'changeUserPassword',
                    args: [{
                        newPassword: this.form.password
                    }]
                })
                this.$emit('close')
                this.$emit('pwdchange')
            } else {
                this.$emit('close')
            }
        },
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
            .pdf__quote{
                margin-bottom: 0px;
                margin-top: 5px;
                font-size: 12px;
                color: darkgray;
            }
               .overlay{
                   position:fixed;
                   top:0px;
                   width: calc(100vw);
                   height: calc(100vh);
                   background-color:rgba(255, 255, 255, 0.5);
                   z-index: 10;
               }
               .profile_details input{
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
               .profile_details img{
                    max-height: 140px;
               }
               .profile_details .form{
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
               .profile_details button{
                margin-top: 30px;

                display: block;
                
                max-width: none;
               }
`
        }
    }
})