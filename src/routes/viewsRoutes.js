const express = require('express');
const router = express.Router();

//Route connect Home Page
router.get('/', (req, res) => {
    res.render('home', {
        layout: 'main',
        title: 'Home Page',
        scripts: '<script src="/js/home.js"></script>'
    });
});

//Route connect AboutUS
router.get('/about', (req, res) => {
    res.render('about', {
        layout: 'main',
        title: 'About Us Page',
    });
});


//Route connect Contact 
router.get('/contact', (req, res) => {
    res.render('contact', {
        layout: 'main',
        title: 'Contact Us Page',
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        layout: false,
        title: 'Login Page',
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        layout: false,
        title: 'Register Page',
    });
});
module.exports = router;