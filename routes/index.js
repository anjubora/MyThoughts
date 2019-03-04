const express =require('express');
const router=express.Router();
const {ensureAuthenticated} = require('../config/auth')
router.get('/',(req,res) => {
    res.render('home');
});
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user : req.user,
        array:array=['anju','neha','ashu','kajal']
    })
})

module.exports=router;