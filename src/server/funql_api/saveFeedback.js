var debug = require('debug')(`app:saveFeedback ${`${Date.now()}`.white}`)

module.exports = app => {
  return async function saveFeedback ({ module_id, title, message }, files) {
    if (!this.req.user) throw new Error('401')

    let user_id = this.req.user.id

    debug({
      user_id,
      module_id,
      title,
      message,
      image: files.image
    })

    let creation_date = require('moment-timezone')()
      .tz('Europe/Paris')
      ._d.getTime()

    var fileBuffer = await require('sander').readFile(files.image.path)
    var savedFile = await app.dbExecute(
      `
        INSERT INTO 
        files(file_type, file_size, file, updated_at)VALUES(?,?,?,?)
        `,
      ['img', files.image.size, fileBuffer, creation_date],
      {}
    )
    let file_id = savedFile.insertId

    return await app.dbExecute(
      `INSERT INTO feedbacks(module_id,user_id,title,message,file_id,creation_date)VALUES(?,?,?,?,?,?)`,
      [parseInt(module_id), user_id, title, message, file_id, creation_date],
      {}
    )
  }
}