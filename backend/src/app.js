'use strict';

(function () {
    // carregar configurações do banco de dados
    require('./database');
    
    const app = require("express")();
    const errorHandler = require('./middlewares/errors');
    const port = ELECTRON_WEBPACK_APP_API_PORT;
    
    // carregar as estratégias de autenticação 
    require('./config/authStrategies')
    
    // carregar middlewares
    const middlewares = require('./middlewares')
    middlewares(app)

    // carregar rotas
    const routes = require('./routes')
    routes(app) 
    
    // carregar middleware de tratamento de erros
    app.use(errorHandler);
    
    app.listen(port, () => { 
        console.log(`Server is running in port ${port}`)
    })

    module.exports = app;

}());