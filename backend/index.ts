import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import dataRouter from './routes/data';

dotenv.config();

const app = express();
app.use(cors());            // <- allow Expo Go to call us
app.use(express.json());

app.get('/ping', (_req, res) => res.send('pong'));

app.use(dataRouter); // /api/items

app.listen(3000, () => console.log('Server running on port 3000'));
