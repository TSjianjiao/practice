var express = require('express');
var router = express.Router();
const regionModel = require('../db/main');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile('../public/index.html', (err, data)=>{
        res.send(data.toString())
    })
});

router.post('/getRegion', (req, res)=>{
    const { parentCode } = req.body;
    regionModel.find({parentCode}).then(data=>{
        res.send(JSON.stringify(data))
    })
})
module.exports = router;
