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
            scripts: '<script src="/js/home.js"></script>',
            user: req.user
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


router.get('/tips', (req, res) => {
    res.render('tips', {
        layout: 'main',
        title: 'Tips & Article Section',
    });
});



module.exports = router;