// Import required modules
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Initialize express app
var app = express();

// Load env and set PORT
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 4000;


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error: ", err));


// Passport config
require('./config/passport')(passport);

// Middleware
// app.use(cors({ credentials: true }));
// app.use(cors({
//     origin: process.env.FRONTEND || 'http://localhost:3000',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
    origin: process.env.FRONTEND || 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept'
    ]
}));

app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
  });

// Session management

app.use(
    session({
        secret: process.env.SECRET || 'Mess_Portal',
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 14 * 24 * 60 * 60
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day session duration
            secure: false, // Use `true` for HTTPS
            httpOnly: true,
            sameSite: 'lax'
        }
    })
);


// Add passport session persistence middleware
app.use((req, res, next) => {
    if (req.session && req.user) {
        // Refresh session expiration on activity
        req.session.touch();
        req.session.save();
    }
    next();
});


app.use(passport.initialize());
app.use(passport.session());



// Debugging middleware
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Authenticated:', req.isAuthenticated());
    console.log('User:', req.user);
    next();
});



//Requests
app.use((req, res, next) => {
    console.log(`Received request for ${req.url}`);
    next();
});

// Check authentication for admin endpoints
app.use('/api/admin/*', (req, res, next) => {
    console.log("here",req);
    if (req.isAuthenticated() && req.user?.email === process.env.ADMIN) next();
    else res.sendStatus(401);
});

// Check authentication for user endpoints
app.use('/api/user/*', (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.sendStatus(401);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));



// Serve frontend
app.use(express.static(__dirname + '/frontend/build'));
app.get('*', (req, res) => res.sendFile(__dirname + '/frontend/build/index.html'));

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
