'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ host: 'localhost', port: '8080' });

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    datadog: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ ops: '*', response: '*' }]
    }, {
        module: 'hapi-good-datadog',
        args: [{
          datadog: {
            prefix: 'example.app.',
            flushIntervalSeconds: 2,
          },
          listeners: {
            ops: (data, datadog) =>
              datadog.gauge('memory.rss', data.proc.mem.rss)
          }
        }]
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
