const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const cookieParser = require('cookie-parser');
const { authenticateToken, requireAuth, checkout } = require('./src/middleware/authMiddleware');

const app = express();
const PORT = 3000;

const Handlebars = require('handlebars');

// Đăng ký helper limit
Handlebars.registerHelper('limit', function (array, limit) {
    return array.slice(0, limit);
});
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});
Handlebars.registerHelper('times', function(n, block) {
    let result = '';
    for (let i = 1; i <= n; i++) {
        result += block.fn(i);
    }
    return result;
});

const viewsRoutes = require('./src/routes/viewsRoutes'); // Điều hướng view
const tourRoutes = require('./src/routes/tourRoutes');  // Điều hướng tour
const registerRoutes = require('./src/routes/registerRoutes'); // Điều hướng đến đăng ký
const loginRoutes = require('./src/routes/loginRoutes'); // Điều hướng đến đăng nhập
const logoutRoute = require('./src/routes/logoutRoutes'); // Điều hướng đăng xuất
const verifyRoutes = require('./src/routes/verifyRoutes'); // Điều hướng xác nhận email
const userRoutes = require('./src/routes/userRoutes'); // Điều hướng đén thông tin cá nhân
const reservationRoutes = require('./src/routes/reservationRoutes'); // Điều hướng đến trang đặt chỗ
const cartRoutes = require('./src/routes/cartRoutes'); // Điều hướng đén trang giỏ hàng

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(authenticateToken);

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

app.use('/register', checkout, registerRoutes);

app.use('/login', checkout, loginRoutes);

app.use('/logout', requireAuth, logoutRoute);

app.use('/verify', checkout, verifyRoutes);

app.use('/user', requireAuth, userRoutes);

app.use('/reservation', reservationRoutes);

app.use('/cart', cartRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
