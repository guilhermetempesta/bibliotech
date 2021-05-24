const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { LoanController } = require('../controllers/LoanController');
const loan = new LoanController;

module.exports = app => {

  app.route('/loans')
    .all(authentication.bearer)
    .post(authorization("createAny", "loans"), loan.store)
    .get(authorization("readAny", "loans"), loan.index)        

  app.route('/loans/:id')
    .all(authentication.bearer)
    .get(authorization("readAny", "loans"), loan.show)         
    .put(authorization("updateAny", "loans"), loan.update)         
    .delete(authorization("deleteAny", "loans"), loan.destroy)   

  app.route('/return-loan')
    .all(authentication.bearer)
    .patch(authorization("updateAny", "loanReturn"), loan.loanReturn)          

  app.route('/cancel-return/:id')
    .all(authentication.bearer)
    .patch(authorization("updateAny", "loanReturn"), loan.cancelLoanReturn)

  app.route('/books/:id/loans')
    .all(authentication.bearer)
    .get(authorization('readAny', 'loans'), loan.indexByBook)

}