const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8081;

app.use(express.static(__dirname + '/dist'));
app.get('/', (req, res) => res.sendFile(__dirname + 'dist/index.html'));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(require('./middleware/auth.js'));
app.use('/api', require('./routes'));

mongoose.connect(process.env.DBURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

app.listen(port);
