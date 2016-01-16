
exports.ensureAuth = function (req, res, next){
  // isAuthenticated is provided function that checks if the user is logged in to google
  if (req.isAuthenticated()) {return next(); }
  // if logged in continue loading page
  res.send();
  // otherwise redirect to signin
  // redirect wasn't working here so we instead send nothing to the client
  // the client side checks if the res is empty and if it is redirects to signin
};
