const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:5000', 'https://localhost:5443'];

const corsOptionDelegate = (req, callback) => {
    let corOptions;
    if (whitelist.includes(req.header('Origin'))) {
        corOptions = { origin: true };
    } else {
        corOptions = { origin: false };
    }
    callback(null, corOptions);
};

exports.cors = cors(); 
exports.corsWithOptions = cors(corsOptionDelegate);
