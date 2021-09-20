const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const pg = require('pg');

const db = require('./services/db');


const PORT = process.env.BACKEND_PORT || 3000;
const app = express();

require('dotenv').config()
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get('/', function (req, res) {
    res.json({
        message: "Hello, this is an app."
    });
})

app.listen(PORT, async function () {
    console.log(`Server is running at http://localhost:${PORT}`);

    db.sync().then(() => {
        console.log(`db connected success`);
    }).catch(function (error) {
        // fail case
        console.error(error);
    });
})