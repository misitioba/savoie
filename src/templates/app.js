module.exports = async (app, config) => {
    var debug = require('debug')(`app:%NAME% ${`${Date.now()}`.white}`)
    var express = require('express');
    app.use(`%NAME%_static`, express.static(config.getPath('static')))
};  