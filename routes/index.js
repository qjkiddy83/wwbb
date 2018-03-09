var express = require('express');
var router = express.Router();
var request = require('request');

var tools = require('../core/tools');

/* GET home page. */
router.get('/', function(req, res, next) {
    tools.getToken(function(data) {
        res.json(data)
    })
});
router.get('/login', function(req, res, next) {
    console.log(req);
    tools.getOpenid(req.query.code, function(data) {
        res.json(data)
    })
});
router.get('/send', function(req, res, next) {
    console.log(req);
    tools.send(req.query.openid, req.query.formid, function(data) {
        res.json(data)
    })
});
router.get('/postTest', function(req, res, next) {
    request({
        url: 'http://localhost:3003/wwbb/postdata',
        method: 'POST',
    	json:true,
        body: {
            "atest": "testtstestes"
        }
    }, function(data) {
        res.json({})
    })
});
router.post('/postdata', function(req, res, next) {
    console.log(req.body);
    res.json({});
});

module.exports = router;