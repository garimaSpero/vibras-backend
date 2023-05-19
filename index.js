const express = require("express");
const route = require("./src/routes");

const cluster = require("cluster");
const os = require("os");

const noCpus = os.cpus().length;
require('dotenv').config();
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


route(app);

const port = 5000;

if(cluster.isMaster){
    for (let i = 0; i < 5; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
    })
} else {
    app.listen(port, () => {
        console.log(`App is now running at port server ${process.pid}`, port)
    })
}
