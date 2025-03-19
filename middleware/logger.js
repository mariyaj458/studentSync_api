const {createLogger,transports,format} = require('winston');
const path = require('path');

const logger = createLogger({
    level:'error',
    format:format.combine(
        format.timestamp(),
        format.json()
    ),
    transports:[
        new transports.File({filename:path.join(__dirname,"../logs/error.log")}),
        new transports.Console() 
    ],
});

module.exports = logger;
