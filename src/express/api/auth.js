var router = require('express').Router()

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
