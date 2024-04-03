import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userServiceRoutes from './routes/userServiceRoute.js';

config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/user', userServiceRoutes); 

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});


