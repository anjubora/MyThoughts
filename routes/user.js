const express=require('express');
const router=express.Router();

var usermodel =require('../models/Users')
var send_email=require('../config/email')
const bcrypt=require('bcryptjs')
const passport=require('passport')
//login page

router.get('/login',(req,res) =>{
    res.render('login')
});

router.get('/register',(req,res)=>{
    res.render('register')
});

router.post('/register',(req,res)=>{
console.log(req.body)
var {name,email,password,password2}=req.body;
var errors=[];
if(!name || !email || !password || !password2){
    errors.push({msg :'please fill in all fiels'})

}
if(password.length< 6){
    errors.push({msg :'password must be of atleast 6 character'})
}
if(password!=password2){
    errors.push({msg :'password must be matched'})
}
if(errors.length >0){
    res.render('register',{
        errors
    })
}
else{
    usermodel.findOne({email:email}).then( (user)=>{
        if(user){
        errors.push({msg :'user with this email exists'})
        console.log(errors.msg)

        res.render('register',{
            errors
        })
        }
         else{


//making document 

        var newuser =new usermodel({
            name,
            email,
            password
        })
        var user={
            name,
            email
        };

        //hashing pasword
        bcrypt.genSalt(10,(err,salt)=>
        bcrypt.hash(newuser.password,salt,(err,hash) =>{
            if(err) throw err;
            //set password to hashed passwrd
            newuser.password=hash;
            newuser.save().then( (user)=>{
            console.log(user);
            req.flash('success_msg','you are now registered can successfully login now')
            send_email.sendemail(user)


            res.redirect('/users/login');
            }),(error)=>{
                console.log(error)
            }
        })
        )
    
    }

    }).catch( (error)=>{
        console.log(error)
    });

}
})

//login handle
router.post('/login', function(req, res, next) {
    passport.authenticate('local', { successRedirect: '/quotes/getquotes',
    failureRedirect: '/users/login',
    failureFlash: true })(req, res, next);
  });

  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
  

module.exports=router;