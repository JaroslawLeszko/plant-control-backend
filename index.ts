import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import {handleError} from "./utils/errors";
import './utils/db';
import {plantsRouter} from "./routers/plants";
import {urlencoded} from "express";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(urlencoded({
    extended: true,
}));

app.use(rateLimit({
    windowMs: 5 * 60 *1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
}))

app.use(express.static('plantImages'));

app.use(express.json());

app.use('/', plantsRouter);

app.use(handleError);

app.listen(3001, 'localhost',() => {
    console.log('Listening on http://localhost:3001');
});