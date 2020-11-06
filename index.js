const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin:
			process.env.NODE_ENV === 'production'
				? process.env.CLIENTURL
				: 'http://localhost:8080'
	}
});
require('./socket/index')(io);

app.use(
	history({
		rewrites: [
			{
				from: /^\/api/,
				to: function (context) {
					return context.parsedUrl.path;
				}
			}
		]
	})
);
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.json());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? process.env.CLIENTURL
				: 'http://localhost:8080'
	})
);
app.use('/api', require('./middleware/auth.js'));
app.use('/api', require('./routes'));

mongoose.connect(process.env.DBURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

http.listen(process.env.PORT || 8081);
