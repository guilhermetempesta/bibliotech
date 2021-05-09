const { BookRepository } = require('../repositories/BookRepository');
const { NotFoundError } = require('../utils/errors');

class BookController {

    async store (req, res, next) {
        try {
            const book = req.body;
            const bookRepository = new BookRepository;
            await bookRepository.create(book);
            res.status(201).send();
        } catch (error) {
            next(error); 
        } 
    }

    async update (req, res, next) {        
        try {
            const book = req.body;
            book.id = req.params.id;
            const bookRepository = new BookRepository;
            await bookRepository.update(book);
            res.status(200).json({ message: "Informações atualizadas com sucesso." });
        } catch (error) {
            next(error); 
        } 
    }

    async index (req, res, next) {
        try {                        
            const bookRepository = new BookRepository;
            const books = await bookRepository.get(); 
            res.status(200).json(books);    
        } catch (error) {
            next(error); 
        }
    }   

    async show (req, res, next) {
        try {                        
            const id = req.params.id;
            const bookRepository = new BookRepository;
            const book = await bookRepository.getById(id); 
            if (!book) {
                throw new NotFoundError('Livro não encontrado!');
            }
            res.status(200).json(book);    
        } catch (error) {
            next(error); 
        }
    }
    
    async destroy (req, res, next) {
        try {                        
            const id = req.params.id;   
            const bookRepository = new BookRepository;
            await bookRepository.remove(id);
            res.status(200).json({ message: "Livro excluído com sucesso." });
        } catch (error) {
            next(error); 
        }
    }     

    async indexByAuthor (req, res, next) {
        try {                        
            const id = req.params.id;
            const page = req.query.page || 1;                       
            const bookRepository = new BookRepository;
            const books = await bookRepository.getByAuthor(id, page); 
            res.status(200).json(books);    
        } catch (error) {
            next(error); 
        }
    }
}

module.exports = { BookController }
