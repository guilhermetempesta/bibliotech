const { Model, DataTypes } = require('sequelize');

class Book extends Model {
    static init(sequelize) {
        super.init({
            code: {
                type: DataTypes.STRING
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Título não informado!' },
                    notEmpty: { msg: 'Título não informado!' }
                }
            },
            publisher: {
                type: DataTypes.STRING,
            },
            localization: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Localização não informada!' },
                    notEmpty: { msg: 'Localização não informada!' }
                }
            },
        }, {
            sequelize,
            tableName: 'books',                     
            paranoid: true
        })
    }

    static associate(models) {
        this.belongsTo(models.Author, { foreignKey: 'authorId', as: 'author' });
    }
}

module.exports = Book;