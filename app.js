const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const session = require('express-session');
const passport = require('passport');

// start the application 
const app = express();

// set up view engine 
app.set('view engine', 'ejs');

// middleware to encrypt our session cookies
app.use(session({
    secret: keys.session.cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// initialize passport 
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb 
mongoose.connect(keys.mongodb.dbURI).then(() => {
    console.log("Connected to database!")
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(3000, () => {
    console.log('App is listening for requests on port 3000');
});
