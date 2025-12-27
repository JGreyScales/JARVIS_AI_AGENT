import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const app = express();

const corsOptions: cors.CorsOptions = {
    origin: '127.0.0.1'
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT: number = 8000;

app.listen(PORT, '127.0.0.1');
