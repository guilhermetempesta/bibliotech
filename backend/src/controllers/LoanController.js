
const { LoanReturnService } = require('../services/LoanReturnService');
const { LoanRepository } = require('../repositories/LoanRepository');
const { NotFoundError } = require('../utils/errors');

class LoanController {

    async store (req, res, next) {
        try {
            const loan = req.body; 
            loan.userLoanId = req.user.id;
            const loanRepository = new LoanRepository;
            await loanRepository.create(loan);
            res.status(201).send();
        } catch (error) {
            next(error); 
        } 
    }

    async update (req, res, next) {        
        try {
            const loan = req.body;
            loan.id = req.params.id;
            const loanRepository = new LoanRepository;
            await loanRepository.update(loan);
            res.status(200).json({ message: "Informações atualizadas com sucesso." });
        } catch (error) {
            next(error); 
        } 
    }

    async index (req, res, next) {
        try {                        
            const query = req.query;
            const loanRepository = new LoanRepository;
            const authors = await loanRepository.get(query); 
            res.status(200).json(authors);    
        } catch (error) {
            next(error); 
        }
    }   

    async show (req, res, next) {
        try {                        
            const id = req.params.id;
            const loanRepository = new LoanRepository;
            const loan = await loanRepository.getById(id); 
            if (!loan) {
                throw new NotFoundError('Livro não encontrado!');
            }
            res.status(200).json(loan);    
        } catch (error) {
            next(error); 
        }
    }
    
    async destroy (req, res, next) {
        try {                        
            const id = req.params.id;   
            const loanRepository = new LoanRepository;
            await loanRepository.remove(id);
            res.status(200).json({ message: "Livro excluído com sucesso." });
        } catch (error) {
            next(error); 
        }
    }     

    async loanReturn (req, res, next) {
        try {                        
            const date = req.body.date;   
            const loanId = req.body.loanId;   
            const userId = req.user.id;   
            const loanReturn = new LoanReturnService;
            await loanReturn.execute(date, loanId, userId);
            res.status(200).json({ message: "Devolução realizada com sucesso." });
        } catch (error) {
            next(error); 
        }
    }

    async cancelLoanReturn (req, res, next) {
        try {                    
            const id = req.params.id;   
            const loanReturn = new LoanReturnService;
            await loanReturn.cancel(id);
            res.status(200).json({ message: "Devolução cancelada com sucesso." });
        } catch (error) {
            next(error); 
        }
    }    
    
    async indexByBook (req, res, next) {
        try {
            const id = req.params.id;
            const page = req.query.page || 1;
            const pending = req.query.pending || false;

            const loanRepository = new LoanRepository;
            const loans = await loanRepository.getByBook(id, page, pending); 
            res.status(200).json(loans);    
        } catch (error) {
            console.log(error)
            next(error); 
        }
    }
}

module.exports = { LoanController }