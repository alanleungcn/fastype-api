const auth = require('./auth.js');

module.exports = (io) => {
  io.use(auth)
  io.on('connection', (socket) => {
    console.log(socket)
  })
}