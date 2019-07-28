const scopeCss = require('scope-css')
var uniqid = require('uniqid')

export default {
    mounted() {
        if (!this.$refs.root) {
            console.warn(
                'Styles mixin requires data.styles and a $refs.root reference. Optionally, you can wrap the entire component under a $refs.scope ref to apply an scoped style.'
            )
        }
        if (this.$refs.scope) {
            this.$refs.scope.id = `scoped_element_${uniqid()}`
            let styles = document.createElement('style')
            styles.setAttribute('scoped', '')
            styles.innerHTML = scopeCss(this.styles, `#${this.$refs.scope.id}`)
            this.$refs.root.appendChild(styles)
        } else {
            let styles = document.createElement('style')
            styles.setAttribute('scoped', '')
            styles.innerHTML = this.styles
            this.$refs.root.appendChild(styles)
        }
    }
}