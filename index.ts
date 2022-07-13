import express from 'express';
import cors from 'cors';
import 'express-async-errors';
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

app.use(express.static('images'));

app.use(express.json());

app.use('/', plantsRouter);

app.use(handleError);

app.listen(3001, 'localhost',() => {
    console.log('Listening on http://localhost:3001');
});