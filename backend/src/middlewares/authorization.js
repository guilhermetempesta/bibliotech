const roles = require('../config/accessControl')

module.exports = (action, resource) => {
    return (req, res, next) => {    
        try {
            // console.log(req.user.role)
            let role;
            (req.user.admin) ? role='admin' : role='user';
            const permission = roles.can(role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    name: "Unauthorized",
                    message: "Acesso não autorizado!"
                });
        }
            next()
        } catch (error) {
            next(error)
        }
    }
}