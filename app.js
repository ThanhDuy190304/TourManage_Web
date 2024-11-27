const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const Handlebars = require('handlebars');

// Đăng ký helper limit
Handlebars.registerHelper('limit', function(array, limit) {
    return array.slice(0, limit);
});

// Cấu hình session
app.use(session({
    secret: 'your_secret_key',  // Chìa khóa bí mật để mã hóa session
    resave: false,              // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true,    // Lưu session mới ngay cả khi chưa có giá trị
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của cookie (1 ngày)
    }
}));

const viewsRoutes = require('./src/routes/viewsRoutes'); // Điều hướng view
const tourRoutes = require('./src/routes/tourRoutes');  // Điều hướng tour
const registerRoutes = require('./src/routes/registerRoutes'); // Điều hướng đến user
const loginRoutes = require('./src/routes/loginRoutes');
const verifyRoutes = require('./src/routes/verifyRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main' // Layout chính
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'))

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', viewsRoutes);

app.use('/tours', tourRoutes);

app.use('/register', registerRoutes);

app.use('/login',loginRoutes);

app.use('/verify', verifyRoutes); // Đây là nơi xử lý các yêu cầu đến /verify

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
