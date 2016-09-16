'use strict';

const Os = require('os');
const Stream = require('stream');
const Hoek = require('hoek');

const Datadog = require('datadog-metrics').BufferedMetricsLogger;

const defaults = {
  datadog: {
    host: Os.hostname(),
  },
  listeners: {}
};

class GoodDatadog extends Stream.Writable {

    constructor(config) {
        super({ objectMode: true });

        const settings = Hoek.applyToDefaults(defaults, config);

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
