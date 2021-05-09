const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { BookController } = require('../controllers/BookController');
const book = new BookController;

module.exports = app => {

  app.route('/books')
    .all(authentication.bearer)
    .post(authorization("createAny", "books"), book.store)
    .get(authorization("readAny", "books"), book.index)

  app.route('/books/:id')
    .all(authentication.bearer)
    .get(authorization("readAny", "books"), book.show)         
    .put(authorization("updateAny", "books"), book.update)         
    .delete(authorization("deleteAny", "books"), book.destroy)   

  app.route('/authors/:id/books')
    .all(authentication.bearer)
    .get(authorization('readAny', 'books'), book.indexByAuthor)
    
}