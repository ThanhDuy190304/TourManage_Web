const express = require('express');
const router = express.Router();
const Tour = require('../modules/tour/tourModel');

//Route connect Home Page
router.get('/', async (req, res) => {
    try {
        const bestdealTours = await Tour.getBestdealTours();
        const bestrateTours = await Tour.getBestrateTours();
        res.render('home', {
            layout: 'main',
            bestdealTours,
            bestrateTours,
            title: 'Home Page',
            scripts: '<script src="/js/home.js"></script>'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

router.get('/forgetpassword',(req, res) => {
    res.render('forgetpassword', {
        layout: false,
        title: 'Forget Password Page',
    })
});

router.get('/new_register',(req, res) => {
    res.render('new_register', {
        layout: false,
        title: 'New Register Page',
    })
})

module.exports = router;