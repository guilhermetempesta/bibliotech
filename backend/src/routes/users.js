const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { UserController } = require('../controllers/UserController');
const user = new UserController;

module.exports = app => {

  app.route('/users')
    .all(authentication.bearer)
    .post(authorization("createAny", "users"), user.store)
    .get(authorization("readAny", "users"), user.index)

  app.route('/users/:id')
    .all(authentication.bearer)
    .get(authorization("readAny", "users"), user.show)         
    .put(authorization("updateAny", "users"), user.update)         
    .delete(authorization("deleteAny", "users"), user.destroy)   

  app.route('/change-password')  
    .all(authentication.bearer)
    .patch(authorization("deleteAny", "changePassword"), user.changePassword)
}