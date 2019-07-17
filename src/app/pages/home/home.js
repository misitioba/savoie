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
        TryDemo(){
            analytics.track("ClickedTryBasketHotDemo", {
                
            });
        },
        async requestDemo() {
            analytics.track("ClickedRequestDemo", {
                email: this.form.email
            });
            if (!this.form.email) {
                alert('Nous avons besoin de votre email pour vous contacter');
                return;
            }
            let result = await axios.post('/api/email/guest/request_demo', this.form)
            console.log(`result`, {
                result
            });
            this.form.email=""
            alert('Merci!, nous vous contacterons bientôt.')
        }
    }
})