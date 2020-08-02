const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const {User} = require('../models/User')

module.exports = function(passport){
  console.log(process.env.GOOGLE_CLIENT_ID);
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/users/google/callback'
  },
    async(accessToken, refreshToken, email, done)=>{
      const googleUser = {
        email : email.emails.value
      }

      try{
        let user = await User.findOne({ email: email.emails.value})
        if(user) done(null, user);
        //@TODO user를 찾지 못하는 경우
      }catch(err){
        console.error(err);
      }
      console.log(email);
  }))

  passport.serializeUser((user, done) =>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
