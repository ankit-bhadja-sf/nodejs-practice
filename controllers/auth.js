const res = require("express/lib/response");
const user = require("../models/user");

exports.getLogin = (req, res, next) => {
console.log(req.session.isLoggedIn);
    // const isLoggedIn = req
    //   .get('Cookie')
      // .split(';')[1]
      // .trim()
      // .split('=')[1] === 'true';

      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
      })
  };

exports.postLogin = (req, res, next) => {
  user.findById('61eeb214240ecb9112ecef11')
  .then( user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      console.log(err);
      res.redirect('/');
    })
  })
  
}

exports.postLogout = (req, res , next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/')
  })
}