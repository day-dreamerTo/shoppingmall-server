/**
 * Created by admin on 17/12/11.
 */
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Goods = require('../models/goods');
let User = require('../models/user');

// 连接数据库
// 有账号密码的形式: 'mongodb://root:1234456@127.0.0.1:27017/dumall'
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected', () => {
    console.log('mongodb connect success');
});

mongoose.connection.on('error', () => {
    console.log('mongodb connect error');
});

mongoose.connection.on('disconnected', () => {
    console.log('mongodb connect disconnected');
});

let handleError = (err, res) => {
    res.json({
        status: 0,
        msg: err.message
    });
    return
};

router.get('/', (req, res, next) => {
    let sort = parseInt(req.param('sort'));
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let priceLevel = req.param('priceLevel');
    let skip = (page - 1) * pageSize;
    let gt = '', lte = '';
    let params = {};
    if (priceLevel != 'all') {
        switch (parseInt(priceLevel)) {
            case 0:
                gt = 0;
                lte = 500;
                break;
            case 1:
                gt = 500;
                lte = 1000;
                break;
            case 2:
                gt = 1000;
                lte = 1500;
                break;
            case 3:
                gt = 1500;
                lte = 2000;
                break;
            case 4:
                gt = 2000;
                lte = 5000;
                break;
            default:
                break;
        }
        params = {
            salePrice: {
                $gt: gt,
                $lte: lte
            }
        }
    }
    let GoodsModel = Goods.find(params);
    // 分页
    GoodsModel.sort({'salePrice': sort}).skip(skip).limit(pageSize);
    GoodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: err.message
            });
        } else {
            res.json({
                status: 1,
                msg: '',
                data: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

router.post('/addCart', (req, res, next) => {
    let userId = '100000077';
    let productId = req.body.productId;
    // 先找到用户
    User.findOne({userId: userId}, (err, userDoc) => {
        if (err) handleError(err, res);
        if (userDoc) {
            let good = '';
            // 如果购物车已经有了对应商品则只操作添加
            userDoc.cartList.forEach((item) => {
                if(item.productId == productId) {
                    good = item;
                    item.productNum++;
                }
            });
            if(good) {
                userDoc.save((err, newDoc) => {
                    if (err) handleError(err, res);
                    res.json({
                        status: 1,
                        msg: '',
                        result: 'success'
                    });
                })
            } else {
                Goods.findOne({productId}, (err, goodDoc) => {
                    if (err) handleError(err, res);
                    if (goodDoc) {
                        goodDoc.productNum = 1;
                        goodDoc.checked = 1;
                        userDoc.cartList.push(goodDoc);
                        userDoc.save((err, newDoc) => {
                            if (err) handleError(err, res);
                            res.json({
                                status: 1,
                                msg: '',
                                result: 'success'
                            });
                        })
                    }
                })
            }
        }
    });
});

module.exports = router;