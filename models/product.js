const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allownull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,

  imageUrl: {
    type: Sequelize.STRING,
    allownull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allownull:false
  },
  decsription: {
    type: Sequelize.STRING,
    allownull: false
  }
});

module.exports = Product;