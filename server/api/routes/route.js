const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');

const Hashids = require("hashids");
const hashids = new Hashids('sdfsd');

const {Category} = require('../../models/category');
const {Product} = require('../../models/product');

//@route PUT api/auth/editProducts
//@description edit Product
router.put('/editProducts' , (req,res) => {
    
    
    let body = _.pick(req.body,['_id','pName','price']);
    
    if (body && Object.keys(body).length && body._id && body.price && body.pName) {
        
        let decryptHash = hashids.decodeHex(body._id);
        console.log(decryptHash);
        
        Product.findOneAndUpdate({
            _id: decryptHash
        },{
            pName: body.pName,
            price: body.price
        }).then((resp) =>{
            
            let result = {};
            if (resp) {
                result = {
                    'status': '201',
                    'message': 'Product has been updated successfully'
                }
            } else {
                result = {
                    'status': '304',
                    'message': 'Not Modified' 
                }
            }
            
            res.json([result]);
            
        });
        
    }
});

module.exports = router;
