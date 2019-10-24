module.exports = app => {
    return async function health() {
        return {
            alive: true
        }
    }
}