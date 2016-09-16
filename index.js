'use strict';

const Os = require('os');
const Stream = require('stream');

const Datadog = require('datadog-metrics').BufferedMetricsLogger;

const internals = {
  defaults: {
    datadog: {
      host: Os.hostname(),
      flushIntervalSeconds: 5,
    },
    listeners: {}
  },
};

class GoodDatadog extends Stream.Writable {

    constructor(config) {
        super({ objectMode: true });

        const settings = Object.assign({}, internals.defaults, config);

        this.datadog = new Datadog(settings.datadog);
        this.listeners = settings.listeners;
    }

    _write(data, enc, callback) {
        const { event } = data;
        const { [event]: listener } = this.listeners;

        if (listener) {
          listener(data, this.datadog);
        }

        callback(null);
    }
}

module.exports = GoodDatadog;
