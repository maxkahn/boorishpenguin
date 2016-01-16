


exports.ensureAuth = function (req, res, next){
  // isAuthenticated is provided function that checks if the user is logged in to google
  if (req.isAuthenticated()) {return next(); }
  // if logged in continue loading page
  res.send();
  // otherwise redirect to signin
  // redirect wasn't working here so we instead send nothing to the client
  // the client side checks if the res is empty and if it is redirects to signin
};


// // exports.signup = function (profileObj, callback){
// //   // profileObj equals the userinfo that google sends upon signin
// //   var user = {};
// //   // creates a user object with only the info we want from google
// //   user.name_last  = profileObj.profile.name.familyName;
// //   user.name_first = profileObj.profile.name.givenName;
// //   user.name = user.name_first + " " + user.name_last;
// //   user.email = profileObj.profile.emails[0].value;
// //   user.username = user.email;
// //   // Email set as username to make sure each username is unique.
// //   // Usernames are used to find to find specific user(s) in the database
// //   // Suggested Improvement: Make this a token or id saved in the database for each user.

  
// //   user.picture = profileObj.profile._json.image.url;

// //   // Other Attributes Google Provides that you may want to utilize
// //   // user.displayName = profileObj.profile.displayName;
// //   // user.gender = profileObj.profile.gender;
// //   // user.nickName = profileObj.profile._json.nickname;

// //   controller.newUser(user);
// //   // saves the new user to the database
// //   return callback(null, user);
// // };

// exports.login = function (profileObj, callback){
//   return callback(null, profileObj);
// };
