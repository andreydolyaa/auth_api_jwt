const express = require('express');
const router = express.Router();
const verify = require('./tokenverification');


//a random route to test if $verify middleware works
router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'some post',
            description: 'some description'
        }
    });
});


module.exports = router;