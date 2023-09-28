const dotenv = require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const methodOverride = require('method-override');

const connectDb = require('./server/config/db');

const session = require('express-session');

const passport = require('passport');

const MongoStore = require('connect-mongo');

const app = express();
const port = 5000 || process.env.PORT;

app.use(session({
    secret: 'gjuahsbak7362t61jqhbw',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: new Date(Date.now() + 108000000)
    }
}))

app.use(passport.initialize());

app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride("_method"));

connectDb();

// Static Files
app.use(express.static('public'));

// Template Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/auth'));

app.use('/', require('./server/routes/index'));

app.use('/', require('./server/routes/dashboard'));


// Handle 404
app.get('*', function(req, res) {
    res.status(404).render('404');
})

app.listen(port, () => {
    console.log(`listening on ${port} for http://localhost:${port}`);
})