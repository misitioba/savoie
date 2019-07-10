
new Vue({
    el:"form",
    data(){
        return {
            form:{
                email:'arancibiajav@gmail.com',
                password:'gtf'
            }
        }
    },
    methods:{
        async login(){
            console.log('lohin!')
            let result = await axios.post('/api/auth',this.form)
            console.log(result,{
                sended:this.form
            });
        },
        async changePassword(){
            console.log('changingPassword')
            let result = await axios.post('/api/auth/password',this.form)
            console.log('changePassword',{
                result
            });
        }
    }
})