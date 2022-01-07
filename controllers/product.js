const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
};


exports.postAddProduct = (req, res,) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.addProducts = (req, res,) => {
    Product.fetchAll(products => {
        res.render('shop', {
            prods: products,
            pageTitle: 'shop', 
            path: '/', 
            hasProducts : products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });    

}
