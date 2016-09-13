'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ host: 'localhost', port: '8080' });

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    myDatadogReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ ops: '*', response: '*' }]
    }, {
        module: process.cwd()
    }],
  }
};

server.register({
  register: require('good'),
  options: options,
}, (err) => {
  if (err) return console.error(err);
  server.start(() => console.log('Server started at ' + server.info.uri));
});
