const Product = require('../models/product');
const { validationResult } = require('express-validator');
const { Mongoose } = require('mongoose');

const fileHelper = require('../util/file');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: "",
    product: {
      title: '',
      imageUrl:'',
      price:'',
      description:''
    },
    validationErrors: []
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log(image);
  if(!image) {
    return res.status(422).render('admin/edit-product', { 
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price:price,
        description:description
      },
      errorMessage: 'Your Attached file is not Image',
      validationErrors: []
    });
  }

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', { 
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false, 
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        // imageUrl:imageUrl,
        price:price,
        description:description
      },
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;
  console.log(imageUrl);

  const product = new Product({
   // _id: new Mongoose.Types.ObjectId('62025fbaa45ae1becb92d707'),
    title: title, 
    imageUrl: imageUrl, 
    price: price, 
    description: description,
    userId: req.user
  });
 
  product.save()
    .then((result) => {
      //console.log(result);
      console.log('created product');
      res.redirect('/admin/products')
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  //Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        product: product,
        errorMessage: '',
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

///////////////////////////////Admin edit Product

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file; 
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
     pageTitle: 'Edit Product',
     path: '/admin/edit-product',
     editing: true,
     hasError: true  ,
     product: {
       title: updatedTitle,
       price: updatedPrice,
       description: updatedDesc
     },
     errorMessage: errors.array()[0].msg,
     validationErrors: errors.array()
   });
  }
  
   Product.findById(prodId)
   .then(product => {
     if (product.userId.toString() !== req.user._id.toString()) {
       return res.redirect('/');
     }
     product.title = updatedTitle;
     product.price = updatedPrice;
     product.description = updatedDesc;
     if (image) {
      fileHelper.deleteFile(product.imageUrl)
      product.imageUrl = image.path;
    }

    
     return product.save()
     .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
   })
   .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

  
};

exports.getProducts = (req, res) => {
  Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then( product => {
      if (!product) {
        return next( new Error('Product not Found'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({_id: prodId, userId: req.user._id})

    })
  .then(() => {
    console.log('DESTROY PROJECT');
    res.status(200).json({ message: 'Success!' })
  })
  .catch(err => {
    res.status(500).json({ message: 'Deleting is failed' })
  });
};