const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncreament:true,
    allowNull:false,
    primarykey:true
  },
})

module.exports = Order;