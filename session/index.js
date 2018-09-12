/** session/index.js */
const session = require('express-session');

module.exports.configure = (app) => {
  const sessionOptions = {
    secret: 'ddsosecret',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sessionOptions.cookie.secure = true; // serve secure cookies
  }
  app.use(session(sessionOptions));
};
