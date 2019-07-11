
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
        async check(){
            let result = await axios.get('/api/auth/check',this.form)
            console.log(`check`, result);
        },
        async login(){
            let result = await axios.post('/api/auth',this.form)
            console.log(result,{
                sended:this.form
            });
        },
        async logout(){
            let result = await axios.get('/api/auth/logout')
            console.log(`result`,{
                result
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