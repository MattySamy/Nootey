const dotenv = require('dotenv').config();
const path = require('path');
const { v4: uuidv4 } = require("uuid");
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const methodOverride = require('method-override');

const connectDb = require('./server/config/db');

const session = require('express-session');

const passport = require('passport');
const cors = require('cors');
const MongoStore = require('connect-mongo');

const multer = require('multer');

const storageEngine = multer.diskStorage({
    destination: (req, file, func) => {
        func(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "-" + file.originalname);
    },
});
const upload = multer({
    storage: storageEngine,
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/gif"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + " is starting ...");
    },
}).single("image");

const app = express();

app.use(cors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

const port = process.env.PORT;

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
app.use(express.urlencoded({ extended: false }));
app.use(upload);
app.use("/images", express.static(path.join(__dirname, "images")));

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