const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const { InvalidArgumentError } = require('../utils/errors');

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Nome completo não informado!' },
                    notEmpty: { msg: 'Nome completo não informado!' }
                }
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Nome de usuário não informado!' },
                    notEmpty: { msg: 'Nome de usuário não informado!' }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Senha não informada!' },
                    notEmpty: { msg: 'Senha não informada!' },
                }
            },
            confirmPassword: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Confirme a senha!' },
                    notEmpty: { msg: 'Confirme a senha!' },
                    isMatch: function () {                        
                        const matched = bcrypt.compareSync(this.confirmPassword, this.password)
                        if (!matched) { 
                            throw new Error ('As senhas não conferem!') 
                        }
                    }
                }
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        }, {
            sequelize,
            tableName: 'users',                     
            paranoid: true,
            setterMethods: {
                password: function(value) {
                    if (value.trim()==='') {
                        throw new InvalidArgumentError('Senha não informada!');
                    } 
                    const salt = bcrypt.genSaltSync(10);
                    const encryptedPassword = bcrypt.hashSync(value, salt);                     
                    this.setDataValue('password', encryptedPassword);
                },
            }, 
        })
    }

    static associate(models) {
      this.hasMany(models.Loan, { foreignKey: 'userLoanId', as: 'loans'});
      this.hasMany(models.Loan, { foreignKey: 'userReturnId', as: 'loansReturn'});
    }
}

module.exports = User;