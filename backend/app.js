const express = require('express');
const {sequelize} = require('./src/models');
const cors = require('cors');
const verifyJWT = require('./src/middleware/verify.JWT');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());

app.use('/auth',require('./src/routes/auth'));
app.use('/register', require('./src/routes/api/register'))
app.use('/refresh',require('./src/routes/api/refresh'));


app.use(verifyJWT);
app.use('/books',require('./src/routes/api/books'));
app.use('/students',require('./src/routes/api/students'));

app.listen(PORT, async()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    await sequelize.authenticate();
})