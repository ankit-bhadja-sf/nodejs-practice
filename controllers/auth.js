const bcrypt = require('bcryptjs')
const User = require("../models/user");


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

  exports.getSignup = (req, res) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
  };

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
  .then( user => {
    if (!user) {
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password)
    .then( doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          return res.redirect('/');
          });
      }
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    })
    
  })
  
}

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  User.findOne({email: email})
  .then( userDoc => {
    if (userDoc) {
      return res.redirect('/login');
    }
    return bcrypt
     .hash(password, 12)
     .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save();
    })
    .then(result => {
      res.redirect('/login')
    })
  })
  
  .catch(err => console.log(err));
}

exports.postLogout = (req, res , next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/')
  })
}