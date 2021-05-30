const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();
app.use(express.json());

//connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database')).catch(err => console.log(err));

//routes middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});