var request = require('request');
var fs = require("fs")
var path = require("path");

const APPID = 'wx9860608916cdb70e';
const APPSECRET = '47f19d4db2656e51e52dea4527519343';

const TOKEN_PATH = path.join(__dirname, '../token', 'token.json');

function getToken(callback) {
    fs.readFile(TOKEN_PATH, function(err, data) { //读取缓存到本地的access_token
        let now = Date.now(),
            cache_token = JSON.parse(data.toString() || "{}");

        if (err || !cache_token.access_token || cache_token.timestamp < now) { //没有读到，重新获取
            console.log("重新获取")
            request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    let new_token = JSON.parse(body.toString());
                    new_token.timestamp = now + 1000 * 60 * 60 * 2; //两个小时过期
                    fs.writeFile(TOKEN_PATH, JSON.stringify(new_token), function(err) { //写入缓存文件
                        if (err) {
                            return console.error(err);
                        }
                        callback(new_token); //返回结果
                    });
                }
            })
        } else {
            callback(JSON.parse(data.toString())); //返回结果
        }
    });
}

function getOpenid(code, callback) {
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body.toString()));
        }
    })
}

function send(openid, formid, callback) {
    getToken(res => {
        request({
            url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${res.access_token}`,
            method: 'POST',
            json: true,
            body: {
                "touser": openid,
                "template_id": "lfZsSIwm0mSh7jGBA2DyteU38cSglKkNC8LEV3-do-w",
                "form_id": formid,
                "data": {
                    "keyword1": {
                        "value": "通知测试",
                        "color": "#173177"
                    },
                    "keyword2": {
                        "value": "2015年01月05日 12:30",
                        "color": "#173177"
                    }
                },
            }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            }
        })
    })
}

module.exports = {
    getToken: getToken,
    getOpenid: getOpenid,
    send: send
}