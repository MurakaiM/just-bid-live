var categoriesPopups = require('../Database/database.categories').categoriesPopups;

exports.live = function (req,res) {
  var pageInfo = {
    pageName : "Live"
  };

  res.render('home', pageInfo);
};

exports.contact = function (req,res) {
  var pageInfo = {
    pageName : "Contact"
  };

  res.render('contact', pageInfo);
};

exports.stock = function (req,res) {
  var pageInfo = {
    pageName : "Stock",
    popups : categoriesPopups.popups
  };

  res.render('stock', pageInfo);
}
