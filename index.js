const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8081;
const clientUrl = process.env.CLIENTURL || 'http://localhost:8080';
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: clientUrl
	}
});
require('./socket/index')(io);

app.use(
	history({
		rewrites: [
			{
				from: /^\/api/,
				to: (ctx) => {
					return ctx.parsedUrl.path;
				}
			}
		]
	})
);
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.json());
app.use(
	cors({
		origin: clientUrl
	})
);
app.use('/api', require('./routes'));

mongoose.connect(process.env.DBURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

http.listen(port);
