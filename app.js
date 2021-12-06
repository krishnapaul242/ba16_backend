const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require("path");

const config = require('./configuration/config');
const db = require('./configuration/dbConn');
const serverErrorHandler = require('./middleware/error/500error');
const notFoundErrorHandler = require('./middleware/error/404error');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const feedRouter = require('./routes/feed');
const orderRouter = require('./routes/order');
const offerRouter = require('./routes/offer');
const bookingRouter = require('./routes/booking');
const dashboardRoute = require('./routes/dashboard');



const app = express();
const port = config.API_DETAILS.PORT;

app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req, res, next) => {
      return res.status(200).json({
          server_name: config.API_DETAILS.NAME,
          server_mode: process.env.NODE_ENV,
      });
});

app.get("/api", async (req, res, next) => {
      return res.status(200).json({
          server_name: config.API_DETAILS.NAME,
          server_mode: process.env.NODE_ENV,
      });
});

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/feed', feedRouter);
app.use('/api/order', orderRouter);
app.use('/api/offer', offerRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/dashboard', dashboardRoute);




app.use(notFoundErrorHandler.errorHandler);
app.use(serverErrorHandler.logErrors);
app.use(serverErrorHandler.clientErrorHandler);
app.use(serverErrorHandler.errorHandler);

db.connect(async (err) => {
    if (err) {
        console.log("MYSQL Database is not connected");
        console.log(err);
    } else {
        console.log("MYSQL Database is connected");
        app.listen(port, () => {
            console.log("Server is listing on port ", port);
        });
    }
});
