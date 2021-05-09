const bcrypt = require('bcrypt-nodejs')
const { UserRepository } = require('../repositories/UserRepository');
const { InvalidArgumentError, BadRequestError } = require('../utils/errors');

class ChangePasswordService {

    async execute (oldPassword, newPassword, confirmPassword) {
        try {
            if ((!oldPassword) || (oldPassword.trim()==='')) { 
                throw new InvalidArgumentError ('Senha antiga não informada!'); 
            }
            if ((!newPassword) || (newPassword.trim()==='')) { 
                throw new InvalidArgumentError ('Nova senha não informada!'); 
            }
            if (!confirmPassword) { 
                throw new InvalidArgumentError ('Confirme a nova senha!'); 
            }
            if (newPassword !== confirmPassword) { 
                throw new InvalidArgumentError ('Confirmação da nova senha não confere!'); 
            }

            const userRepository = new UserRepository();
            
            const passwordFromDB = await userRepository.getPassword(id);
            if(!passwordFromDB) {
                throw new BadRequestError('Erro ao verificar senha.')
            }
            const matched = bcrypt.compareSync(oldPassword, passwordFromDB)
            if (!matched) { 
                throw new Error ('As senhas não conferem!') 
            }
            await userRepository.changePassword(id, newPassword);

        } catch (error) {
            throw error; 
        }
    }
}

module.exports = { ChangePasswordService }