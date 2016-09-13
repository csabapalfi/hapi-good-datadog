'use strict';

const Os = require('os');
const Stream = require('stream');

const Datadog = require('datadog-metrics').BufferedMetricsLogger;

const internals = {
  defaults: {
    apiKey: process.env.DATADOG_API_KEY,
    host: Os.hostname(),
    prefix: '',
    flushIntervalSeconds: 15
  },
};

// Good Reporter API: https://github.com/hapijs/good/blob/master/API.md#reporter-interface
class GoodDatadog extends Stream.Writable {

    constructor(config) {
        super({ objectMode: true });
        config = config || {};
        const settings = Object.assign({}, internals.defaults, config);
        this.metrics = new Datadog(settings);
    }

    _write(data, enc, callback) {
        const eventName = data.event;

        if (eventName === 'ops') {
          this.metrics.gauge('memory.rss', data.proc.mem.rss);
          this.metrics.gauge('load.-1m', data.os.load[0]);
        }

        if (eventName === 'response') {
          this.metrics.histogram('latency', data.responseTime);
          this.metrics.increment(`status.${data.statusCode}`)
        }

        // console.log('data %s', JSON.stringify(data, null, 2));
        callback(null);
    }
}

module.exports = GoodDatadog;
