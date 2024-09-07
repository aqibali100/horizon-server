const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const router = require('./routes/route.users');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200
}));

app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

app.use('/api/users', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
