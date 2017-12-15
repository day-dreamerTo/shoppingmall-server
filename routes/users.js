var express = require('express');
var router = express.Router();

let User = require('../models/user');

let handleError = (err, res) => {
    res.json({
        status: 0,
        msg: err.message
    });
    return;
};

router.post('/login', (req, res, next) => {
    let param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    };
    User.findOne(param, (err, doc) => {
        // 数据库查找错误
        if (err) handleError(err, res);
        if (doc) {
            // 保存cookie  向浏览器写cookie
            res.cookie('userId', doc.userId, {
                path: '/',// cookie 放在根目录下
                maxAge: 1000 * 60 * 60 // cookie 周期
            });
            res.cookie('userName', doc.userName, {
                path: '/',// cookie 放在根目录下
                maxAge: 1000 * 60 * 60 // cookie 周期
            });
            // req.session.user = doc;// 存入session
            res.json({
                status: 1,
                msg: '',
                result: {
                    userName: doc.userName,
                }
            })
        } else {
            // 用户名或密码错误
            res.json({
                status: 0,
                msg: '用户名或密码错误'
            });
        }
    })
});

router.post('/logout', (req, res, next) => {
    // 清空前端cookie
    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    });
    res.cookie('userName', '', {
        path: '/',
        maxAge: -1
    });
    res.json({
        status: 1,
        msg: '',
        result: '退出成功'
    })
});

router.get('/checkLogin', (req, res, next) => {
   if(req.cookies.userId) {
       res.json({
           status: 1,
           msg: '',
           result: req.cookies.userName
       })
   } else {
       res.json({
           status: 1,
           msg: '当前未登录',
           result: ''
       })
   }
});

module.exports = router;
