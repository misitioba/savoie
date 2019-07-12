var debug = require('debug')(`app:admin:generator ${`${Date.now()}`.white}`);
var builder = require('../../lib/builder');


var COMMON_CONTEXT = {
  head: {
    titlePrefix: `Savoie Tech Coop`,
    title: ''
  },
  isDevelopment: process.env.NODE_ENV !== 'production'
};

module.exports = async function generateProject(app){
  app.builder = builder;

  function objectMerge(self, savedData) {
    if (savedData === undefined) {
      return;
    }
    Object.keys(self).forEach(k => {
      if (typeof self[k] === 'object' && !(self[k] instanceof Array)) {
        objectMerge(self[k], savedData[k]);
      } else {
        self[k] = savedData[k] || self[k];
      }
    });
    Object.keys(savedData).filter(k => Object.keys(self).indexOf(k) == -1).forEach(newK => {
      self[newK] = savedData[newK];
    })
  }

  function getCommonContext (ctx) {
    let baseCtx = require('lodash').cloneDeep(COMMON_CONTEXT);
    objectMerge(
      baseCtx,
      ctx
    );
    return baseCtx;
  }

  await builder.transformFile({
    target: '/index.html',
    source: 'src/app/pages/home/home.pug',
    mode: 'pug',
    transform: [app.cacheCDNScripts],
    context: getCommonContext({
      head:{
        title: 'Home'
      }
    })
  })

  await builder.transformFile({
    target: '/login/index.html',
    source: 'src/app/pages/login/login.pug',
    mode: 'pug',
    transform: [app.cacheCDNScripts],
    context: getCommonContext({})
  })

  await builder.transformFile({
    target: '/legal-mentions/index.html',
    source: 'src/app/pages/legal-mentions.pug',
    mode: 'pug',
    transform: [app.cacheCDNScripts],
    context: {
      head: {
        title: 'Mention Legal - Savoie'
      }
    }
  })

  debug('done'.green)
}