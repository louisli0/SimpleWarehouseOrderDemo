const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
  // Refresh Token
  if (req.url == '/refresh') {
    console.log('refresh token');
    return next();
  }
  let accessToken = req.headers.authorization.split('Bearer ')[1];
  if (!accessToken) {
    console.log('No Auth header');
    return res.status(403).send();
  }

  try {
    jwt.verify(accessToken, process.env.JWTSECRET, (err, result) => {
      if (err) {
        console.log('Middleware err', err.message);
        return res.status(403).send(err.message);
      }
      return next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).send();
  }
};

// Need staff only action
