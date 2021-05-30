const Book = require('../models/Book');
const Loan = require('../models/Loan');
const { MethodNotAllowedError, NotFoundError } = require('../utils/errors');

class BookRepository {

    async create(data) {
        try {   
            const book = await Book.create(data);   
            return book;     
        } catch(err) {
            throw err
        }
    }

    async update(data) {
        try {
            await Book.update(data,{   
                    where: {id: data.id}
                }
            );
        } catch(err) {
            throw err
        }
    }

    async get(query) {
        try {
            const { author, page, orderBy } = query;

            let filter = {};
            if (author) filter = {...filter, '$author.id$': author};

            let ordenation = [];
            if (orderBy) ordenation = setOrderBy(orderBy);

            if (!page) {
                const books = await Book.findAll({
                    attributes: ['id', 'code', 'title', 'publisher', 'localization'],
                    include: [{
                        association: 'author',
                        attributes: ['id', 'name']
                    }],                
                    where: filter,
                    order: ordenation
                })
                return books
            } else {
                const limit = 10 // limite usado para paginacao
                const { count, rows } = await Book.findAndCountAll({
                    attributes: ['id', 'code', 'title', 'publisher', 'localization'],
                    include: [{
                        association: 'author',
                        attributes: ['id', 'name']
                    }],              
                    order: ['title'],
                    limit: limit,                // limite por pagina  
                    offset: page * limit - limit // deslocamento
                })
                return { data: rows, count, limit}
            }              
        } catch (err) {
            throw err
        }
    }

    async getById(id) {
        try {
            const book = await Book.findOne({ 
                attributes: ['id', 'code', 'title', 'publisher', 'localization'],
                include: [{
                    association: 'author',
                    attributes: ['id', 'name']
                }],
                where: {id: id} 
            })
            return book;
        } catch (err) {
            throw err
        }
    }

    async getByAuthor(id, page) { 
        try {
            const limit = 50; // limite usado para paginacao            
            const { count, rows } = await Book.findAndCountAll({ 
                attributes: ['id', 'code', 'title', 'publisher', 'localization'],
                include: [{
                    association: 'author',
                    attributes: ['id', 'name']
                }],                
                where: {authorId: id},
                order: ['id'],
                limit: limit,                // limite por pagina  
                offset: page * limit - limit // deslocamento                 
            })
            return { data: rows, count, limit}  
        } catch (err) {
            throw err
        }
    }

    async count() {
        try {
            const count = await Book.count();
            return count;
        } catch (err) {
            throw err
        }
    }

    async remove(id) {
        try { 
            const loans = await Loan.count({
                where: { studentId: id }
            })
            if (loans) throw new MethodNotAllowedError('Este livro possui vínculos.');

            const rowsDeleted = await Book.destroy({
                where: {id: id} 
            });
            if (rowsDeleted===0) throw new NotFoundError('Livro não encontrado!'); 
        } catch (err) {
            throw err
        }
    }
}

module.exports = { BookRepository }

function setOrderBy(option) {
    if (option==0) return ['title']  
    if (option==1) return [['author','name']]  
    if (option==2) return ['localization'] 
}