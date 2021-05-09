'use strict';

require('dotenv').config();

(function () {
    require('./database');
    
    const app = require("express")();
    const consign = require('consign');
    const errorHandler = require('./middlewares/errors');
    
    const port = process.env.PORT;
    
    consign()
        .include('./src/middlewares/index.js')
        .then('./src/utils')
        .then('./src/config')
        .then('./src/repositories')
        .then('./src/controllers')
        .then('./src/routes')
        .into(app); 
    
    app.use(errorHandler);
        
    app.listen(port, () => { 
        console.log(`Server is running in port ${port}`)
    })

    module.exports = app;

}());