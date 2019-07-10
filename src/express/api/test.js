var router = require('express').Router()
router.post('/', async (req, res) => {
  let dbConnection = await req.getMysqlConnection();
  const [rows, fields] = await dbConnection.execute(`SELECT * FROM users`, []);

  res.json({
    result: rows,
    form: req.body
  });
});
module.exports = router;
