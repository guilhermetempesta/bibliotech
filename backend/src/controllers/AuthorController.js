const { AuthorRepository } = require('../repositories/AuthorRepository');
const { NotFoundError } = require('../utils/errors');

class AuthorController {

    async store (req, res, next) {
        try {
            const author = {
                name: req.body.name
            };
            const authorRepository = new AuthorRepository;
            await authorRepository.create(author);
            res.status(201).send();
        } catch (error) {
            next(error); 
        } 
    }

    async update (req, res, next) {        
        try {
            const author = {
                name: req.body.name,
            };
            author.id = req.params.id;
            const authorRepository = new AuthorRepository;
            await authorRepository.update(author);
            res.status(200).json({ message: "Informações atualizadas com sucesso." });
        } catch (error) {
            next(error); 
        } 
    }

    async index (req, res, next) {
        try {                        
            const authorRepository = new AuthorRepository;
            const authors = await authorRepository.get(); 
            res.status(200).json(authors);    
        } catch (error) {
            next(error); 
        }
    }   

    async show (req, res, next) {
        try {                        
            const id = req.params.id;
            const authorRepository = new AuthorRepository;
            const author = await authorRepository.getById(id); 
            if (!author) {
                throw new NotFoundError('Autor não encontrado!');
            }
            res.status(200).json(author);    
        } catch (error) {
            next(error); 
        }
    }
    
    async destroy (req, res, next) {
        try {                        
            const id = req.params.id;   
            const authorRepository = new AuthorRepository;
            await authorRepository.remove(id);
            res.status(200).json({ message: "Autor excluído com sucesso." });
        } catch (error) {
            next(error); 
        }
    }     
}

module.exports = { AuthorController }
