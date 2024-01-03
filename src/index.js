const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;
const db = require('./config/db/connectodb');
const count = require('./app/controllers/handlebars-helper');
const methodOverride = require('method-override')
const session = require('express-session');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src', 'public')));

db.connect();


// Sử dụng session middleware
app.use(session({
  secret: 'your-secret-key', // Thay thế bằng một chuỗi bí mật an toàn
  resave: false,
  saveUninitialized: true,
}));



// tạo đối tượng router, giống như cái ổ cắm chung
const route = require('./routes');
app.use(methodOverride('_method'))

// Tạo đối tượng Handlebars
const handlebars = exphbs.create({
  extname: '.hbs', // Cấu hình đuôi mở rộng mặc định cho Handlebars

  runtimeOptions: {
   allowProtoPropertiesByDefault: true,
   allowProtoMethodsByDefault: true,
 },

  helpers: {
    add: (a,b) => a+b,
  },

});


app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

// HTTP logger
app.use(morgan('combined'));
//Đăng ký helper
// Template engine
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.set('views', [
  path.join(__dirname, 'resources', 'views'),
  path.join(__dirname, 'resources', 'views', 'layouts'),
]);

app.set('layout', 'layouts/main'); // Chỉ định layout chung

// lấy cái router cắm chung cắm vào index.js, file này được npm setting rồi

route(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
