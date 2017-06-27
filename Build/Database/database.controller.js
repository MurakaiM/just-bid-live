"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const connectionString = 'postgres://admin:md53c17b0bb7cd76e4f80ad10e45d4acb56@localhost:5432/auction';
var sequelize = new Sequelize(connectionString, {
    logging: false,
    dialect: 'postgres'
});
/*
sequelize.authenticate()
  .then(() => initSchemas().then(()=> console.log("All schemas are initialized")))
  .catch(err => console.error('Unable to connect to the database:', err));


/* User schema
const User = sequelize.define('user', {
  uid: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  password_date: {
    type: Sequelize.DATE,
    defaultValue: 0
  },
  password_link: {
    type: Sequelize.TEXT,
    defaultValue: ""
  },
  salt: {
    type: Sequelize.STRING(15),
    allowNull: false
  },
  veryfied: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
});
*/
