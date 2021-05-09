const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { AuthorController } = require('../controllers/AuthorController');
const author = new AuthorController;

module.exports = app => {

  app.route('/authors')
    .all(authentication.bearer)
    .post(authorization("createAny", "authors"), author.store)
    .get(authorization("readAny", "authors"), author.index)

  app.route('/authors/:id')
    .all(authentication.bearer)
    .get(authorization("readAny", "authors"), author.show)         
    .put(authorization("updateAny", "authors"), author.update)         
    .delete(authorization("deleteAny", "authors"), author.destroy)   

}