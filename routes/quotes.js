const express =require('express');
const router=express.Router();
var quote=require('../models/quotes')
var user=require('../models/Users')
let date = require('date-and-time');
var mongoose=require('mongoose')

const {ensureAuthenticated} = require('../config/auth')

router.get('/getquotes',ensureAuthenticated,(req,res)=>{

    var quotearray=[];
    quote.find()
    .populate('postedby')
    .exec(function(error, post) {
        console.log(typeof post)
        quotearray=post;
      
       
        res.render('getquotes',{
            user:req.user,
            quotearray:quotearray
        });
    })
});

router.get('/write',ensureAuthenticated,(req,res)=>{

res.render('addquotes',
{
    user:req.user
})

});

router.post('/saveQuotes',(req,res)=>{
var topic=req.body.topic;
var quotetext=req.body.quote;
var user=req.user;
console.log(topic,'',quotetext,'',user);

var  newquote = new quote({
    topic:topic,
    quote:quotetext,
    postedby:user._id
});

newquote.save(function(error,doc) {
    if (!error) {
        console.log(doc)
    }
    
    res.redirect('/quotes/write');
    
});


});

router.get('/getmyquotes',(req,res)=>{
    //var quotearray=[];
    var user=req.user;
    console.log(user._id)
    var id=mongoose.Types.ObjectId(user._id);

    quote.find({ 'postedby': user._id }, function (err, doc){
        // doc is a Document
       // quotearray=doc;
       console.log(doc)
        res.render('dashboard',{
        user,
         doc 
        })

      });
});

router.get('/delete/:id',(req,res)=>{

var id=req.params.id;
console.log('id is:',id)

quote.findByIdAndRemove(id, (err, quote) => {
    
    if (err) {
        console.log('error is:',err)
    }
    else{
     console.log('deleted succssfully')   
    console.log(quote);
    }
   // res.redirect('dashboard');
    res.redirect('/quotes/getmyquotes')
    
});
});


router.post('/updatequote/:id',(req,res)=>{
    
    var id=req.params.id;
    var newquote=req.body.updatedquote;


    quote.findByIdAndUpdate(id, { quote:newquote },{rawResult:true},(err,docs)=>{

if(err){
    console.log(err);
}
else{
    console.log('updated successfully');
    console.log(docs)

}
res.redirect('/quotes/getmyquotes')

    })




})


module.exports=router;