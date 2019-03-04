const mongoose =require('mongoose')

const quoteschema=mongoose.Schema({
    topic:{
        type :String,
        required : true
    },
    quote :{
        type :String,
        required : true
    },
     date :{
        type :String,
        default :Date.now
    },
    postedby:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }

    }


);


module.exports =mongoose.model('quote',quoteschema)