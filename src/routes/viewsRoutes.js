const express = require('express');
const router = express.Router();

//Route connect Home Page
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        scripts: '<script src="/js/home.js"></script>'
    });
});

//Route connect AboutUS
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us Page',
    });
});


//Route connect Contact 
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us Page',
    });
});

//Route connect Login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

//Route connect Register
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

module.exports = router;