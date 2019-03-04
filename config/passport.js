const LocalStrategy =require('passport-local').Strategy
const mongoose=require('mongoose')
const usermodel=require('../models/Users')
const bcrypt=require('bcryptjs')

module.exports=function(passport){

    passport.use( 
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            usermodel.findOne({email:email}).then( (user)=>{
                if(!user){
                    return done(null,false,{message:'this email is not registered'})
                }
                //match password

                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw error;
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'password is incorrect'})
                    }
                })
            }).catch((error)=>{
                console.log(error)
            })
        }
        )
    )



    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        usermodel.findById(id, function(err, user) {
            
          done(err, user);
        });
      });
};