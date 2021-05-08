const User = require('../models/User');
const { InvalidArgumentError } = require('../utils/errors');

class UserRepository {

    async create(data) {
        try {   
            await this.checkUsernameExists(data.username);
            const user = await User.create(data);   
            return user;     
        } catch(err) {
            throw err
        }
    }

    async update(data) {
        try {
            await User.update(data, {   
                where: {
                    id: data.id
                }
            });
        } catch(err) {
            throw err
        }
    }

    async get() {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'username', 'admin']
            })
            return users
        } catch (err) {
            throw err
        }
    }

    async getById(id) {
        try {
            const user = await User.findOne({ 
                attributes: ['id', 'name', 'username', 'admin'],
                where: {id: id} 
            })
            return user;
        } catch (err) {
            throw err
        }
    }

    async getByUsername(username) {
        try {
            const user = await User.findOne({ 
                where: {username: username} 
            })
            return user;
        } catch (err) {
            throw err
        }
    }

    async count() {
        try {
            const usersCount = await User.count();
            return usersCount;
        } catch (err) {
            throw err
        }
    }

    async remove(id) {
        try {
            await User.destroy({
                where: {id: id} 
            });
        } catch (err) {
            throw err
        }
    }

    async checkUsernameExists(username) {
        try {
            if (!username) {
                throw new InvalidArgumentError ('Nome de usuário não informado!')
            } 
            const count = await User.count({ 
                where: { username: username }
            });
            if (count>0) { 
                throw new InvalidArgumentError ('Este nome de usuário já foi utilizado!');
            }
        } catch (error) {
            throw error;
        } 
    }

    async changePassword(id, password) {
        try {
            const [ updated ] = await User.update(
                { password: password }, 
                { where: { id: id } }
            )
            return updated
        } catch (err) {
            throw err
        }
    }
}

module.exports = { UserRepository }