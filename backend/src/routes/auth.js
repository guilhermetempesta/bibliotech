const authentication = require('../middlewares/authentication');
const { AuthController } = require('../controllers/AuthController'); 
const { UserController } = require('../controllers/UserController');
const auth = new AuthController; 
const user = new UserController;

module.exports = app => {

    app.get("/", (req, res) => {
        res.status(200).json({ message: "Bem vindo ao BiblioTech!" })
    })

    app.route('/signup')
        .post(user.store)

    app.route('/login')
        .post(authentication.local, auth.login)

    app.route('/validate-token')
        .post(auth.validateToken)
}    