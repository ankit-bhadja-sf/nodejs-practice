const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncreament:true,
    allowNull:false,
    primaryKey:true
  },
  quantity: Sequelize.INTEGER
})

module.exports = OrderItem;