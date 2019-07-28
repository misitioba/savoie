import Fingerprint2 from 'fingerprintjs2'
var murmur = ''
let options = {}
Fingerprint2.getPromise(options).then(function(components) {
    var values = components.map(function(component) {
        return component.value
    })
    murmur = Fingerprint2.x64hash128(values.join(''), 31)
    api.funql({
        name: 'saveMurmur',
        args: [murmur, btoa(JSON.stringify(components)), Date.now()]
    })
})

function waitForMurmur() {
    return new Promise((resolve, reject) => {
        function loop() {
            if (!murmur) {
                setTimeout(() => loop(), 50)
            } else {
                resolve()
            }
        }
        loop()
    })
}

window.murlytics = {
    async track(params) {
        if (!params.name) throw new Error('Provide name')
        await waitForMurmur()
        api.funql({
            name: 'saveMurmurEvent',
            args: [murmur, params.name, btoa(JSON.stringify(params)), Date.now()]
        })
    }
}

export default murlytics