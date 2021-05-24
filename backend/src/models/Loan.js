const { Model, DataTypes } = require('sequelize');

class Loan extends Model {
    static init(sequelize) {
        super.init({            
            loanDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Data do empréstimo não informada!' },
                    notEmpty: { msg: 'Data do empréstimo não informada!' }
                }
            },           
            returnDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Data para devolução não informada!' },
                    notEmpty: { msg: 'Data para devolução não informada!' }
                }
            },
            returnedAt: {
                type: DataTypes.DATEONLY,
            },
            comments: {
                type: DataTypes.STRING,
            },
            bookNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Número do livro não informado!' },
                    notEmpty: { msg: 'Número do livro não informado!' }
                }
            },
        }, {
            sequelize,
            tableName: 'loans',                     
            paranoid: true
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userLoanId', as: 'userLoan' });
        this.belongsTo(models.User, { foreignKey: 'userReturnId', as: 'userReturn' });
        this.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
        this.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
    }
}

module.exports = Loan;