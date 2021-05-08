const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];

console.log('Carregar configurações do banco de dados');

const models = {};
const modelsDir = path.join(__dirname, '../models');

// criar nova conexão
sequelize = new Sequelize(config);

// carregar models
fs.readdirSync(modelsDir)
    .forEach(file => {
        const model = require(path.join(modelsDir, file));
        models[model.name] = model;
    })
        
// inicializar models    
Object.keys(models).forEach(model => {
    models[model].init(sequelize);
})

// carregar associations
Object.keys(models).forEach((model) => {
    if (models[model].associate) {
    models[model].associate(models);
    }
});

// carregar conexões
models.sequelize = sequelize;    
models.Sequelize = Sequelize;

module.exports = sequelize;