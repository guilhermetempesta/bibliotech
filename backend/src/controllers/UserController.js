const { UserRepository } = require('../repositories/UserRepository');
const { ChangePasswordService } = require('../services/ChangePasswordService');

class UserController {

    async store (req, res, next) {
        try {
            const user = req.body;
            const userRepository = new UserRepository;
            const newUser = await userRepository.create(user);
            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso!' 
            });
        } catch (error) {
            next(error); 
        } 
    }

    async update (req, res, next) {        
        try {
            const user = {
                id: req.params.id,
                name: req.body.name,
                admin: req.body.admin
            };
            const userRepository = new UserRepository;
            await userRepository.update(user);
            res.status(200).json({ message: "Usuário atualizado com sucesso." });
        } catch (error) {
            next(error); 
        } 
    }

    async index (req, res, next) {
        try {                        
            const userRepository = new UserRepository;
            const users = await userRepository.get(); 
            res.status(200).json(users);    
        } catch (error) {
            next(error); 
        }
    }

    async show (req, res, next) {
        try {      
            const id = req.params.id;
            const userRepository = new UserRepository;
            const user = await userRepository.getById(id); 
            res.status(200).json(user);    
        } catch (error) {
            next(error); 
        }
    }
    
    async destroy (req, res, next) {
        try {                        
            const id = req.params.id;   
            const userRepository = new UserRepository;
            await userRepository.remove(id);
            res.status(200).json({ message: "Usuário excluído com sucesso." });
        } catch (error) {
            next(error); 
        }
    } 

    async updateSelf (req, res, next) {        
        try {          
            const user = {
                id: req.user.id,
                name: req.body.name
            };
            const userRepository = new UserRepository;
            await userRepository.update(user);
            res.status(200).json({ message: "Informações atualizadas." });
        } catch (error) {
            next(error); 
        } 
    }
    
    async showSelf (req, res, next) {
        try {                        
            const id = req.user.id;
            const userRepository = new UserRepository;
            const user = await userRepository.getById(id); 
            res.status(200).json(user);    
        } catch (error) {
            next(error); 
        }
    }

    async changePassword (req, res, next) {
        try {   
            const { oldPassword, newPassword, confirmPassword } = req.body;
            
            const changePassword = new ChangePasswordService();
            await changePassword.execute(oldPassword, newPassword, confirmPassword);

            res.status(200).json({ 
                message: "Sua senha foi alterada com sucesso!" 
            });             
        } catch (error) {
            next(error) 
        }
    }
}

module.exports = { UserController }