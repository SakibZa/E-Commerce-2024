import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import ConnectDB from './config/db.js';
import routes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
dotenv.config();
ConnectDB();



//if config was not in root folder then we did 
//dotenv.config({path:"./config.env"})
const PORT = process.env.PORT || 8001;
const app = express();

app.get('/',(req, res)=>{
    res.send('<h1>Hello World</h1>')
})
//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//routes

app.use('/api/v1/auth', routes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/Order', orderRoutes);

app.listen(PORT , ()=>{
    console.log(`Sever started on ${PORT}` .bgCyan.red);
})
