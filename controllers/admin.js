const Product = require('../models/product');
const { validationResult } = require('express-validator');

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
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title, 
    imageUrl: imageUrl, 
    price: price, 
    description: description,
    userId: req.user
  });
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
        imageUrl:imageUrl,
        price:price,
        description:description
      },
      validationErrors: errors.array()
    });
  }
  product.save()
    .then((result) => {
      //console.log(result);
      console.log('created product');
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
};

// exports.getEditProduct = (req, res) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   Product});
// }
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
    .catch(err => console.log(er));
};

///////////////////////////////Admin edit Product

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  
   Product.findById(prodId)
   .then(product => {
     if (product.userId.toString() !== req.user._id.toString()) {
       return res.redirect('/')
     }
     product.title = updatedTitle;
     product.imageUrl = updatedImageUrl;
     product.price = updatedPrice;
     product.description = updatedDesc;

     const errors = validationResult(req)

     if (!errors.isEmpty()) {
       return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true  ,
        product: {
          title: updatedTitle,
          imageUrl: updatedImageUrl,
          price: updatedPrice,
          description: updatedDesc
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
     }
     return product.save()
     .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
   })
  .catch(err => console.log(err))

  
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
    .catch(err => console.log(err));

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
  .then(() => {
    console.log('DESTROY PROJECT');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};