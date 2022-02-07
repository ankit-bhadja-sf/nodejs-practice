const crypto = require('crypto')
const res = require("express/lib/response");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const user = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key:'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'
  }
}));




exports.getLogin = (req, res, next) => {  
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0]
    } else{
      message = null;
    }
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message
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
  User.findOne({ email: email})
  .then( user => {
    if (!user){
      req.flash('error', 'Invalid email or password.')
      return res.redirect('/login')
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/')
    });
      }
      req.flash('error', 'Invalid email or password.')
      res.redirect('/login')
    })
    .catch( err => {
      console.log(err);
      res.redirect('/login')
    }) 
  })
  .catch(err => {
    console.log(err);
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
      return transporter.sendMail({
        to: email,
        from: 'ankit.bhadaja@seaflux.tech',
        subject: 'Signup succeeded!',
        html: '<h1>You Successfully signed up!</h1>'
      });
    })
      .catch(err => {
        console.log(err);
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
    if (message.length > 0) {
      message = message[0]
    } else{
      message = null;
    }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      console.log(user);
      if (!user){
        req.flash('error', 'No User Found for This Email')
        return res.redirect('/reset')
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then( result => {
      console.log(result);
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'ankit.bhadaja@seaflux.tech',
        subject: 'Password Reset',
        html: ` 
          <p>Your Request a password Reset</p>
          <p>Click this <a href='http://localhost:3000/reset/${token}'>link </a> to Set a new Password. </p>
          `
      });
    })
    .catch(err => {
      console.log(err);
    });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0]
    } else{
      message = null;
    }
  res.render('auth/new-password', {
    path:'/new-password',
    pageTitle: 'New Password',
    errorMessage: message,
    userId: user._id.toString(),
    passwordToken: token
  });
 })
  .catch(err => {
    console.log(err);
  })

}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken, 
    resetTokenExpiration: {$gt: Date.now() },
    _id: userId
  })
  .then( user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login')
  })
  .catch(err => {
    console.log(err);
  })
};