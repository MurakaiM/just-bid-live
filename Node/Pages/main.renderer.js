
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
