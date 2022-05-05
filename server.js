const path = require('path');
const passport = require("passport");
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const pictures = require('./routes/pictures');
const admins = require("./routes/admins");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use('/api/v1/pictures', pictures);
app.use('/api/v1/admins', admins);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
    
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));