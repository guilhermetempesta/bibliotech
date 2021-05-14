const tokens = require('../utils/tokens') ;

class AuthController {

  async login (req, res, next) {
    try {
        const accessToken = tokens.access.create(req.user);
        res.set('Authorization', accessToken);
        res.status(200).json({ message: 'Usuário autenticado com sucesso.' });
    } catch (error) {
        next(error)
    }
  }

  async validateToken (req, res, next) {
      try {
          const userData = req.body || null
          if (userData) {
              const payload = await tokens.access.check(userData.token);
              if (payload) return res.send(true)
          }                        
      } catch (error) {
          res.send(false)
      }
  }

}

module.exports = { AuthController }