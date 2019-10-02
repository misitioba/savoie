module.exports = app =>
    function getDebugInstance(name) {
        return require('debug')(
                `${`app:${name}`.padEnd(15, ' ')} ${`${Date.now()}`.white}`
    )
  }