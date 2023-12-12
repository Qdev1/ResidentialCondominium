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
const complaintRoutes = require('./app/routers/complaintRoutes');
const notificationRoutes = require('./app/routers/notificationRoutes');
const visitorsRoutes = require('./app/routers/visitorsRoutes');
const residenceRulesRoutes = require('./app/routers/residenceRulesRoutes');
const residentMeetingRoutes = require('./app/routers/residentEventsRoutes');
const maintenanceHistoryRoutes = require('./app/routers/maintenanceHistoryRoutes');
const contractsRoutes = require('./app/routers/contractsRouter');
const entryRoutes = require('./app/routers/entryRoutes');
const emergencyRoutes = require('./app/routers/emergencyRoutes');
const customerEnrollmentRoutes = require('./app/routers/customerEnrollmentRoutes');
const receptionRouter = require('./app/routers/receptionRouter');
const accessCardRoutes = require('./app/routers/accessCardRoutes');
const paymentRoute = require('./app/routers/paypal');
const maintenanceFundsRoute = require('./app/routers/maintenanceFundsRoutes');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/assetCategory', assetCategoryRoute);
app.use('/api/assets', assetsRoute);
app.use('/api/events', eventsRoute);
app.use('/api/maintenance-plans', maintenancePlanRoute);
app.use('/api/vendors', vendorsRoute);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/visitors', visitorsRoutes);
app.use('/api/residence-rules', residenceRulesRoutes);
app.use('/api/meetings', residentMeetingRoutes);
app.use('/api/maintenance-history', maintenanceHistoryRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/entry', entryRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/customer-enrollment', customerEnrollmentRoutes);
app.use('/api/reception', receptionRouter);
app.use('/api/access-card', accessCardRoutes);
app.use('/api/payment', paymentRoute);
app.use('/api/maintenance-funds', maintenanceFundsRoute);


const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
