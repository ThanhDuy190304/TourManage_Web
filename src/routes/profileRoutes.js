const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile', {
        layout: 'main',
        title: 'Profile page',
        scripts: '<script src="/js/profile.js"></script>',

    });
});


router.get('/editProfile', (req, res) => {
    res.render('editProfile', {
        layout: false,
    });
});
module.exports = router;
