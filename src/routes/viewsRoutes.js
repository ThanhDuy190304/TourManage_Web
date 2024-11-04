const express = require('express');
const router = express.Router();
const path = require('path');

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

//Route connect Tours 
router.get('/tours', (req, res) => {
    res.render('tours', {
        layout: 'main',
        title: 'Tours Page',
        scripts: '<script src="/js/tours.js"></script>'
    });
});

//Route connect Contact 
router.get('/contact', (req, res) => {
    res.render('contact', {
        layout: 'main',
        title: 'Contact Us Page',
    });
});

// Route connect Tour_details
router.get('/tour_detail/:id', (req, res) => {
    res.render('tour_detail', {
        layout: 'main',
        title: 'Tour Detail',
        scripts: '<script src="/js/tour_detail.js"></script>',
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