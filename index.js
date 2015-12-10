'use strict';

import morgan from 'morgan';
import bunyan from 'bunyan';
import useragent from 'useragent';
import status from 'statuses';

const { LOG_LEVEL = 'info' } = process.env;

const instance = bunyan.createLogger({
  name: 'http',
  streams: [{ stream:process.stdout, level:LOG_LEVEL }]
});

const default_log_format = ':remote-addr ":method :url HTTP/:http-version" :status :response-time ms ":user-agent"';

export const httplogger = ({ meta = {}, format = default_log_format, logger = instance } = {}) => {
  return morgan(function(tokens, req, res){

    const format_string = (fmt) => {
      return fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, (_, token, arg) => {
        if (token === 'user-agent') {
          return useragent.lookup(req.headers['user-agent']).toString();
        }
        if (token === 'status') {
          let code = tokens[token](req, res, arg);
          return `${code} ${status[code]}`;
        }
        return (token in tokens && typeof tokens[token] === 'function') && tokens[token](req, res, arg) || '-';
      });
    };

    let data = {};
    for (let key of Object.keys(meta)) {
      data[key] = format_string(meta[key]);
    }

    let level = (tokens.status(req, res) >= 400) ? 'error' : 'info';
    logger[level]({ ...{ id:req.id, ip:(req.headers['x-real-ip'] || req.ip) }, ...data }, format_string(format));
  });
};

httplogger.token = morgan.token;
httplogger.combined = morgan.combined;
httplogger.common = morgan.common;
httplogger.short = morgan.short;
httplogger.tiny = morgan.tiny;
httplogger.default = default_log_format;

export default httplogger;
