const mongodb = require('mongodb');
const getdb = require('../util/database').getdb;  
class Product {
  constructor(title, imageUrl, price, decsription){
    this.title =title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.decsription = decsription;
  }
  save() {
    const db = getdb();
    return db.collection('products').insertOne(this)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err)
    })
  }

  static fetchAll() {
    const db = getdb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => {
      console.log(err);
    });
  }

  static findById(prodId) {
    const db = getdb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) })
    .next()
    .then(product => {
      console.log(product);
      return product;
    })
    .catch(err => {
      console.log(err);
    })
  }
}

module.exports = Product;