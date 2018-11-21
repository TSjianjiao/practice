const mongoose = require('mongoose');
const testData = require('./test_data');
mongoose.connect('mongodb://localhost:27017/country', { useNewUrlParser: true },
err=>err ? console.log(err) : console.log('连接成功'));
const regionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:Number,
        required:true,
    },
    parentCode:{
        type:Number,
        required:true,
    }
})
const regionModel = mongoose.model('region', regionSchema, 'region');
//添加数据
// testData.forEach(item=>{
//     const saveData = new regionModel(item);
//     saveData.save();
// })
module.exports = regionModel;