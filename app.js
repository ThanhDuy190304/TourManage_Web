const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const { authenticateToken, requireAuth } = require('./src/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

const Handlebars = require('handlebars');

// Đăng ký helper limit
Handlebars.registerHelper('limit', function (array, limit) {
    return array.slice(0, limit);
});


const viewsRoutes = require('./src/routes/viewsRoutes'); // Điều hướng view
const tourRoutes = require('./src/routes/tourRoutes');  // Điều hướng tour
const registerRoutes = require('./src/routes/registerRoutes'); // Điều hướng đến đăng ký
const loginRoutes = require('./src/routes/loginRoutes'); // Điều hướng đến đăng nhập
const logoutRoute = require('./src/routes/logoutRoutes'); // Điều hướng đăng xuất
const verifyRoutes = require('./src/routes/verifyRoutes'); // Điều hướng xác nhận email
const profileRoutes = require('./src/routes/profileRoutes'); // Điều hướng đén thông tin cá nhân

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

app.use('/register', registerRoutes);

app.use('/login', loginRoutes);

app.use('/logout', logoutRoute);

app.use('/verify', verifyRoutes);

app.use('/profile', requireAuth, profileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
