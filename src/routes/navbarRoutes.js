const express = require('express');
const router = express.Router();

app.get('/', (req, res) => {
    if (res.locals.user) {
        const username = res.locals.user.username;
        return res.status(200).json({ username });
    }
    return res.status(401).json({ message: 'Unauthorized' });
});
