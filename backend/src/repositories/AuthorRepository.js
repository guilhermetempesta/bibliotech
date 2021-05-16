const Author = require('../models/Author');
const Book = require('../models/Book');
const { MethodNotAllowedError, NotFoundError } = require('../utils/errors');

class AuthorRepository {

    async create (data) {
        try {   
            const author = await Author.create(data);   
            return author;     
        } catch(err) {
            throw err
        }
    }

    async update (data) {
        try {
            await Author.update(data,{   
                    where: {id: data.id}
                }
            );
        } catch(err) {
            throw err
        }
    }

    async get (query) {
        try {
            const page = query.page  
            if (!page) {
                const authors = await Author.findAll({
                    attributes: ['id', 'name'],
                    order: ['name']
                })
                return authors
            } else {
                const limit = 10 // limite usado para paginacao
                const { count, rows } = await Author.findAndCountAll({
                    attributes: ['id', 'name'],
                    order: ['name'],
                    limit: limit,                // limite por pagina  
                    offset: page * limit - limit // deslocamento
                })
                return { data: rows, count, limit}
            }
        } catch (err) {
            throw err
        }
    }

    async getById (id) {
        try {
            const author = await Author.findOne({ 
                attributes: ['id', 'name'],
                where: {id: id} 
            })
            return author;
        } catch (err) {
            throw err
        }
    }

    async count () {
        try {
            const count = await Author.count();
            return count;
        } catch (err) {
            throw err
        }
    }

    async remove (id) {
        try { 
            const books = await Book.count({
                where: { authorId: id }
            })
            if (books) throw new MethodNotAllowedError('Este autor possui livros cadastrados.');

            const rowsDeleted = await Author.destroy({
                where: {id: id} 
            });
            if (rowsDeleted===0) throw new NotFoundError('Autor não encontrado!'); 
        } catch (err) {
            throw err
        }
    }
}

module.exports = { AuthorRepository }