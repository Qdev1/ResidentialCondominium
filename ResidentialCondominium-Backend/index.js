const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); 
const app = express();
const _CONST = require('./app/config/constant')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

require('./app/models/createTables');

// Thay đổi kết nối cơ sở dữ liệu
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'root',
    database: 'residential'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

const authRoute = require('./app/routers/auth');
const userRoute = require('./app/routers/user');
const roomRoute = require('./app/routers/roomRoutes');
const assetCategoryRoute = require('./app/routers/assetCategoryRoutes');
const assetsRoute = require('./app/routers/assetRoutes');
const eventsRoute = require('./app/routers/assetEventRoutes');
const maintenancePlanRoute = require('./app/routers/maintenancePlanRoutes');
const vendorsRoute = require('./app/routers/vendorRoutes');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/assetCategory', assetCategoryRoute);
app.use('/api/assets', assetsRoute);
app.use('/api/events', eventsRoute);
app.use('/api/maintenance-plans', maintenancePlanRoute);
app.use('/api/vendors', vendorsRoute);

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
