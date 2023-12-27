const handlebarsCount = require('handlebars');

// Đăng ký helper 'add'
handlebarsCount.registerHelper('add', function (value, increment) {
  return value + increment;
});

module.exports = handlebarsCount;