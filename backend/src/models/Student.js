const { Model, DataTypes } = require('sequelize');

class Student extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Nome não informado!' },
                    notEmpty: { msg: 'Nome não informado!' }
                }
            },
            phone: {
                type: DataTypes.STRING,
            },
            class: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Turma não informada!' },
                    notEmpty: { msg: 'Turma não informada!' }
                }
            },
            comments: {
                type: DataTypes.STRING
            }
        }, {
            sequelize,
            tableName: 'students',                     
            paranoid: true
        })
    }

    static associate(models) {
      this.hasMany(models.Loan, { foreignKey: 'studentId', as: 'loans'});
    }
}

module.exports = Student;