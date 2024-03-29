'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const taskRoutes = require('./routes/task-routes');
const rewardRoutes = require('./routes/reward-routes');
const userRoutes = require('./routes/user-routes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api', taskRoutes.routes);
app.use('/api', rewardRoutes.routes);
app.use('/api', userRoutes.routes);
app.listen(config.port, () => console.log('App is listening on url http'+config.port));