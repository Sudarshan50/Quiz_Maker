const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({

    quizId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    answers:{
        type:Array,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    delete:{
        type:Boolean,
        default:false
    }
});
module.exports = mongoose.model("Score",scoreSchema);