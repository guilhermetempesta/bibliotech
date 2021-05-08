const { Model, DataTypes } = require('sequelize');

class Author extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Nome não informado!' },
                    notEmpty: { msg: 'Nome não informado!' }
                }
            }
        }, {
            sequelize,
            tableName: 'authors',                     
            paranoid: true
        })
    }

    static associate(models) {
      this.hasMany(models.Books, { foreignKey: 'authorId', as: 'books'});
    }
}

module.exports = Author;