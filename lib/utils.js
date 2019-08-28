"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNamespaceId = exports.checkKeys = exports.checkKeyValueMap = exports.checkMultipleKeysLength = exports.checkKeyValue = exports.checkKey = exports.isString = exports.checkLimit = exports.getPathWithQueryString = exports.getQueryString = exports.removeUndefineds = exports.responseBodyResolver = exports.httpsReq = exports.httpsAgent = exports.ERROR_PREFIX = exports.MAX_MULTIPLE_KEYS_LENGTH = exports.MIN_EXPIRATION_TTL_SECONDS = exports.MAX_VALUE_LENGTH = exports.MAX_KEY_LENGTH = exports.MIN_KEYS_LIMIT = exports.MAX_KEYS_LIMIT = void 0;

var _https = _interopRequireDefault(require("https"));

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_KEYS_LIMIT = 1000;
exports.MAX_KEYS_LIMIT = MAX_KEYS_LIMIT;
const MIN_KEYS_LIMIT = 10;
exports.MIN_KEYS_LIMIT = MIN_KEYS_LIMIT;
const MAX_KEY_LENGTH = 512;
exports.MAX_KEY_LENGTH = MAX_KEY_LENGTH;
const MAX_VALUE_LENGTH = 2 * 1024 * 1024;
exports.MAX_VALUE_LENGTH = MAX_VALUE_LENGTH;
const MIN_EXPIRATION_TTL_SECONDS = 60;
exports.MIN_EXPIRATION_TTL_SECONDS = MIN_EXPIRATION_TTL_SECONDS;
const MAX_MULTIPLE_KEYS_LENGTH = 10000;
exports.MAX_MULTIPLE_KEYS_LENGTH = MAX_MULTIPLE_KEYS_LENGTH;
const ERROR_PREFIX = '@sagi.io/workers-kv';
exports.ERROR_PREFIX = ERROR_PREFIX;
const httpsAgent = new _https.default.Agent({
  keepAlive: true
});
exports.httpsAgent = httpsAgent;

const httpsReq = (options, reqBody = '') => new Promise((resolve, reject) => {
  options.agent = httpsAgent;

  const req = _https.default.request(options, res => {
    const {
      headers
    } = res;
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => responseBodyResolver(resolve)(headers, data));
  });

  req.on('error', e => reject(e));
  !!reqBody && req.write(reqBody);
  req.end();
});

exports.httpsReq = httpsReq;

const responseBodyResolver = resolve => (headers, data) => {
  const contentType = headers['content-type'];

  if (contentType.includes('text/plain')) {
    resolve(data);
  } else if (contentType.includes('application/json') || contentType.includes('application/octet-stream')) {
    resolve(JSON.parse(data));
  } else {
    throw new Error(`${ERROR_PREFIX} only JSON or plain text content types are expected.`);
  }
};

exports.responseBodyResolver = responseBodyResolver;

const removeUndefineds = obj => JSON.parse(JSON.stringify(obj));

exports.removeUndefineds = removeUndefineds;

const getQueryString = obj => _querystring.default.stringify(removeUndefineds(obj));

exports.getQueryString = getQueryString;

const getPathWithQueryString = (path, qs) => path + (qs ? `?${qs}` : '');

exports.getPathWithQueryString = getPathWithQueryString;

const checkLimit = limit => {
  if (limit < MIN_KEYS_LIMIT || limit > MAX_KEYS_LIMIT) {
    throw new Error(`${ERROR_PREFIX}: limit should be between ${MIN_KEYS_LIMIT} and ${MAX_KEYS_LIMIT}. Given limit: ${limit}.`);
  }
};

exports.checkLimit = checkLimit;

const isString = x => typeof x === 'string' || x && Object.prototype.toString.call(x) === '[object String]';

exports.isString = isString;

const checkKey = key => {
  if (!key || !isString(key) || key.length > MAX_KEY_LENGTH) {
    throw new Error(`${ERROR_PREFIX}: Key length should be less than ${MAX_KEY_LENGTH}. `);
  }
};

exports.checkKey = checkKey;

const checkKeyValue = (key, value) => {
  checkKey(key);

  if (!value || !isString(value) || value.length > MAX_VALUE_LENGTH) {
    throw new Error(`${ERROR_PREFIX}: Value length should be less than ${MAX_VALUE_LENGTH}.`);
  }
};

exports.checkKeyValue = checkKeyValue;

const checkMultipleKeysLength = (method, length) => {
  if (length > MAX_MULTIPLE_KEYS_LENGTH) {
    throw new Error(`${ERROR_PREFIX}: method ${method} must be provided a container with at most ${MAX_MULTIPLE_KEYS_LENGTH} items.`);
  }
};

exports.checkMultipleKeysLength = checkMultipleKeysLength;

const checkKeyValueMap = keyValueMap => {
  const entries = keyValueMap ? Object.entries(keyValueMap) : [];

  if (!entries.length) {
    throw new Error(`${ERROR_PREFIX}: keyValueMap must be an object thats maps string keys to string values.`);
  }

  checkMultipleKeysLength('checkKeyValue', entries.length);
  entries.forEach(([k, v]) => checkKeyValue(k, v));
};

exports.checkKeyValueMap = checkKeyValueMap;

const checkKeys = keys => {
  if (!keys || !Array.isArray(keys) || !keys.length) {
    throw new Error(`${ERROR_PREFIX}: keys must be an array of strings (key names).`);
  }

  checkMultipleKeysLength('checkKeys', keys.length);
  keys.forEach(checkKey);
};

exports.checkKeys = checkKeys;

const getNamespaceId = (baseInputs, namespaceId) => {
  const nsId = namespaceId || baseInputs.namespaceId;

  if (!nsId) {
    throw new Error(`${ERROR_PREFIX}: namepspaceId wasn't provided to either WorkersKV or the specific method.`);
  }

  return nsId;
};

exports.getNamespaceId = getNamespaceId;