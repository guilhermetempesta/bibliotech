const Loan = require('../models/Loan');
const { Sequelize, Op } = require('sequelize');
const { NotFoundError } = require('../utils/errors');

class LoanRepository {

    async create(data) {
        try {   
            const loan = await Loan.create(data);   
            return loan;     
        } catch(err) {
            throw err
        }
    }

    async update(data) {
        try {
            await Loan.update(data,{   
                    where: {id: data.id} 
                }
            );
        } catch(err) {
            throw err
        }
    }

    async get(query) {
        try {
            const filters = queryFilter(query);
            const page = query.page || 1;  
            const limit = 200; // limite usado para paginacao 
            let orderBy = [];
            (query.orderBy==='desc') ? orderBy = [['loanDate', 'DESC']] : orderBy = ['loanDate']            

            const { count, rows } = await Loan.findAndCountAll({
                attributes: ['id', 'loanDate', 'returnDate', 'returnedAt', 'comments', 'bookNumber'],
                where: filters,
                include: [{
                    association: 'student',
                    attributes: ['id', 'name', 'phone', 'class']
                },{
                    association: 'book',
                    attributes: ['id', 'code', 'title', 'publisher'],
                    include: [{
                      association: 'author',
                      attributes: ['id', 'name'],
                    }] 
                },{
                    association: 'userLoan',
                    attributes: ['id', 'name']
                },{
                    association: 'userReturn',
                    attributes: ['id', 'name']
                }],
                order: orderBy,
                limit: limit,                // limite por pagina  
                offset: page * limit - limit // deslocamento
            })
            return { data: rows, count, limit}  
        } catch (err) {
            throw err
        }
    }

    async getById(id) {
        try {
            const loan = await Loan.findOne({ 
              attributes: ['id', 'loanDate', 'returnDate', 'returnedAt', 'comments', 'bookNumber'],
              include: [{
                association: 'student',
                attributes: ['id', 'name', 'phone', 'class']
              },{
                association: 'book',
                attributes: ['id', 'code', 'title', 'publisher'],
                include: [{
                  association: 'author',
                  attributes: ['id', 'name'],
                }] 
              },{
                association: 'userLoan',
                attributes: ['id', 'name']
              },{
                association: 'userReturn',
                attributes: ['id', 'name']
              }],
              where: {id: id}
            })
            
            return loan;
        } catch (err) {
            throw err
        }
    }

    async count() {
        try {
            const count = await Loan.count();
            return count;
        } catch (err) {
            throw err
        }
    }

    async remove(id) {
        try {            
            const rowsDeleted = await Loan.destroy({
                where: {id: id} 
            });
            if (rowsDeleted===0) throw new NotFoundError('Empréstimo não encontrado!'); 
        } catch (err) {
            throw err
        }
    }

    async getByBook(id, page, pending) { 
        try {
            let filters = { bookId: id }
            if (pending) filters = {...filters, returnedAt: null} 

            const limit = 50; // limite usado para paginacao            
            const { count, rows } = await Loan.findAndCountAll({ 
                attributes: [ 'id', 'loanDate', 'returnDate', 'returnedAt', 'bookNumber'],
                include: [{
                    association: 'book',
                    attributes: ['id', 'code', 'title']
                },{
                    association: 'student',
                    attributes: ['id', 'name', 'phone', 'class']
                }],                
                where: filters,
                order: ['id'],
                limit: limit,                // limite por pagina  
                offset: page * limit - limit // deslocamento                 
            })
            return { data: rows, count, limit}  
        } catch (err) {
            throw err
        }
    }
}

module.exports = { LoanRepository }


function queryFilter (queryParams) {
  let filters = {};

  const { book, student, status, initialLoanDate, finalLoanDate, initialReturnDate, finalReturnDate, 
          initialReturnedAt, finalReturnedAt, userLoan, userReturn } = queryParams;
  
  if (userLoan) {
      filters = {...filters, userLoanId: userLoan};
  }

  if (userReturn) {
    filters = {...filters, userReturnId: userReturn};
  }

  if (book) {
      filters = {...filters, bookId: book};
  }

  if (student) {
      filters = {...filters, studentId: student};
  }

  if (status) {
      if (status==='finished') {
          filters = {...filters, returnedAt: {[Op.ne]: null}};
      }
      if (status==='pending') {
          filters = {...filters, returnedAt: null};
      }
  }

  if (initialLoanDate && finalLoanDate) {
      filters = {...filters, loanDate: {[Op.between]: [initialLoanDate, finalLoanDate]}};
  }

  if (initialReturnDate && finalReturnDate) {
      filters = {...filters, returnDate: {[Op.between]: [initialReturnDate, finalReturnDate]}};
  }

  if (initialReturnedAt && finalReturnedAt) {
      filters = {...filters, returnedAt: {[Op.between]: [initialReturnedAt, finalReturnedAt]}};
  }

  return filters;    
}