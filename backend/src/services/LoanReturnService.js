const Loan = require('../models/Loan');
const { InvalidArgumentError } = require('../utils/errors');

class LoanReturnService {

    async execute (date, loanId, userId) {
        try {
            validate(date, loanId, userId);
            const [updated] = await Loan.update({ 
                    returnedAt: date,
                    userReturnId: userId  
                },{ 
                where: { 
                    id: loanId,
                    returnedAt: null 
                }},
            );
            return updated;
        } catch (error) {
            throw error;
        }      
    }

    async cancel (loanId) {
        try {
            const [ updated ] = await Loan.update(
                { 
                  returnedAt: null,
                  userReturnId: null
                },
                { where: { 
                    id: loanId 
                }},
            );
            return updated
        } catch (error) {
            throw error;
        }      
    }
}

module.exports = { LoanReturnService }

function validate (date, loanId, userId) {
    try {
        if (!date) { 
            throw new InvalidArgumentError ('Data de devolução não informada!'); 
        }
        if (!loanId) { 
            throw new InvalidArgumentError ('Empréstimo não informado!'); 
        }
        if (!userId) { 
            throw new InvalidArgumentError ('Usuário não identificado!'); 
        }
    } catch (error) {
        throw error
    }
}