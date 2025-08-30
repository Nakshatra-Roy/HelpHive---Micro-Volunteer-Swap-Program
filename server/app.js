import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from 'dotenv';
config();
import User from './models/userModel.js';
import taskRoutes from './routes/taskRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = app.get('socketio');
  next();
});


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/tasks', taskRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;