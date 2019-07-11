var router = require('express').Router()

var debug = require('debug')(`app:api:auth ${`${Date.now()}`.white}`);

function authorize(roles = []){
  
  return async function(req, res, next){
      if(req.session.isLogged && req.session.userId){
        req.user = await req.findUser({
          id: req.session.userId
        });
        next();
      }else{
        if(req.params.redirect){
          res.redirect('/login')
        }else{
          debug(`authorize 401`.yellow);
          res.json(401);
        }
      }
  };
}

router.get('/logout',authorize(),(req,res)=>{
  req.session.isLogged = false;
  delete req.session.userId;
  res.status(200).json(true);
});

router.get('/check',authorize(),(req,res)=>{
  var _ = require('lodash')
  res.json({
    authorized:true,
    user: _.omit(req.user,['password'])
  });
});

router.post('/', async (req, res) => {
  var bcrypt = require('bcrypt')
  let hash = await req.getPasswordHashFromUserByEmail(req.body.email)
  let isPasswordOk = await bcrypt.compare(req.body.password, hash)
  req.session.isLogged = true
  req.session.email = req.body.email
  req.user = await req.findUser({
    email: req.body.email
  });
  req.session.userId = req.user.id;
  var _ = require('lodash')
  res.json({
    form: req.body,
    isPasswordOk,
    user: _.omit(req.user,['password'])
  });
});

router.post('/password', async (req, res) => {
  await req.editUserPassword(req.body.email, 'oldPassword', req.body.password);
  res.json({
    result: true
  });
});

module.exports = router
