new Vue({
    el: ".app",
    data() {
        return {
            form: {
                email: ''
            }
        }
    },
    created() {
        //location.href = '/login'
    },
    methods: {
        async requestDemo() {
            if (!this.form.email) {
                alert('Nous avons besoin de votre email pour vous contacter');
                return;
            }
            let result = await axios.post('/api/email/guest/request_demo', this.form)
            console.log(`result`, {
                result
            });
        }
    }
})