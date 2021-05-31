const authSecret = ELECTRON_WEBPACK_APP_AUTH_SECRET;
const jwt = require('jsonwebtoken');

function createJwtToken (user, expiration) {
    const now = Math.floor(Date.now() / 1000); // data atual em formato unix
    expirationDate = now + expiration;         // soma data atual com tempo de expiração

    const payload = {
        id: user.id,
        name: user.name,
        username: user.username,
        admin: user.admin,
        iat: now,
        exp: expirationDate
    }

    const token = jwt.sign(payload, authSecret)
    return token
}

async function checkJwtToken(token) {
  const payload = jwt.verify(token, authSecret);
  return payload;
}

module.exports = {
  access: {
    expiration: (60 * 60 * 8 * 1),
    create(user) {
      return createJwtToken(user, this.expiration);
    },
    check(token) {
      return checkJwtToken(token);
    }
  },

};
