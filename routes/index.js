var express = require('express');
var request = require('request');
var fs = require("fs")
var path = require("path");
var router = express.Router();

const APPID = 'wx9860608916cdb70e';
const APPSECRET = '47f19d4db2656e51e52dea4527519343';

const TOKEN_PATH = path.join(__dirname, '../token', 'token.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile(TOKEN_PATH, function(err, data) {//读取缓存到本地的access_token
    	let now = Date.now(),
    		cache_token = JSON.parse(data.toString()||"{}");

        if (err || !cache_token.access_token || cache_token.timestamp < now) {//没有读到，重新获取
        	console.log("重新获取")
            request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                	let new_token = JSON.parse(body.toString());
                	new_token.timestamp = now+1000*60*60*2;//两个小时过期
                    fs.writeFile(TOKEN_PATH, JSON.stringify(new_token), function(err) {//写入缓存文件
                        if (err) {
                            return console.error(err);
                        }
                        res.json(new_token);//返回结果
                    });
                }
            })
        } else {
            res.json(JSON.parse(data.toString()));//返回结果
        }
    });

});

module.exports = router;