import express, {Router} from 'express';
import cors from 'cors';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import {handleError} from "./utils/errors";
import './utils/db';
import {plantsRouter} from "./routers/plants";
import {urlencoded} from "express";
import {config} from "./config/config";

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));

app.use(urlencoded({
    extended: true,
}));

app.use(rateLimit({
    windowMs: 5 * 60 *1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
}));

app.use('/plantImages', express.static(__dirname + '/plantImages'));

app.use(express.json());

const router = Router();

router.use('/', plantsRouter);

app.use('/api', router);

// app.use('/',plantsRouter);

app.use(handleError);

app.listen(3001, 'localhost',() => {
    console.log('Listening on http://localhost:3001');
});