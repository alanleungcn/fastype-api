require('dotenv').config();
const cors = require('cors');
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const port = process.env.PORT || 8081;
const clientUrl = process.env.CLIENTURL || 'http://localhost:8080';
const io = require('socket.io')(http, {
	cors: {
		origin: clientUrl
	}
});
require('./socket/index')(io);

app.use(
	cors({
		origin: clientUrl
	})
);
app.use(bodyParser.json());
app.use('/api', require('./routes'));

mongoose.connect(process.env.DBURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

http.listen(port);
