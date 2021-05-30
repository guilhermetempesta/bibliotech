const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { StudentController } = require('../controllers/StudentController');
const student = new StudentController;

module.exports = app => {

  app.route('/students')
    .all(authentication.bearer)
    .post(authorization("createAny", "students"), student.store)
    .get(authorization("readAny", "students"), student.index) 
    
  app.route('/students/class')
    .all(authentication.bearer)
    .get(authorization("readAny", "students"), student.indexClass) 

  app.route('/students/:id')
    .all(authentication.bearer)
    .get(authorization("readAny", "students"), student.show)         
    .put(authorization("updateAny", "students"), student.update)         
    .delete(authorization("deleteAny", "students"), student.destroy) 
    
}