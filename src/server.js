import express from 'express';
import dotenv from 'dotenv';
import workOrderRoutes from './routes/workOrderRoutes.js';
import { connectProducer } from './kafka/producer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectProducer();

app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

app.use('/work-orders', workOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
