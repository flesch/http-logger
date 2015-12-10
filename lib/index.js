'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httplogger = undefined;

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _useragent = require('useragent');

var _useragent2 = _interopRequireDefault(_useragent);

var _statuses = require('statuses');

var _statuses2 = _interopRequireDefault(_statuses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$env$LOG_LEVE = process.env.LOG_LEVEL;
var LOG_LEVEL = _process$env$LOG_LEVE === undefined ? 'info' : _process$env$LOG_LEVE;

var instance = _bunyan2.default.createLogger({
  name: 'http',
  streams: [{ stream: process.stdout, level: LOG_LEVEL }]
});

var default_log_format = ':remote-addr ":method :url HTTP/:http-version" :status :response-time ms ":user-agent"';

var httplogger = exports.httplogger = function httplogger() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$meta = _ref.meta;
  var meta = _ref$meta === undefined ? {} : _ref$meta;
  var _ref$format = _ref.format;
  var format = _ref$format === undefined ? default_log_format : _ref$format;
  var _ref$logger = _ref.logger;
  var logger = _ref$logger === undefined ? instance : _ref$logger;

  return (0, _morgan2.default)(function (tokens, req, res) {

    var format_string = function format_string(fmt) {
      return fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function (_, token, arg) {
        if (token === 'user-agent') {
          return _useragent2.default.lookup(req.headers['user-agent']).toString();
        }
        if (token === 'status') {
          var code = tokens[token](req, res, arg);
          return code + ' ' + _statuses2.default[code];
        }
        return token in tokens && typeof tokens[token] === 'function' && tokens[token](req, res, arg) || '-';
      });
    };

    var data = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(meta)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        data[key] = format_string(meta[key]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var level = tokens.status(req, res) >= 400 ? 'error' : 'info';
    logger[level](_extends({ id: req.id, ip: req.headers['x-real-ip'] || req.ip }, data), format_string(format));
  });
};

httplogger.token = _morgan2.default.token;
httplogger.combined = _morgan2.default.combined;
httplogger.common = _morgan2.default.common;
httplogger.short = _morgan2.default.short;
httplogger.tiny = _morgan2.default.tiny;
httplogger.default = default_log_format;

exports.default = httplogger;
