/////////////////////////////////////////////////////////CREATE SERVER

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
//const routes = require('./routes')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('../util/path');

app.use(bodyParser.urlencoded({extended:false}));
app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
    res.sendFile(path.join(rootDir, 'views/404.html'));    
});



app.listen(3000);