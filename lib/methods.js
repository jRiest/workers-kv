"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METHODS = exports.deleteMultipleKeys = exports.writeMultipleKeys = exports.deleteKey = exports.readKey = exports.writeKey = exports.listNamespaces = exports.listAllKeys = exports.listKeys = void 0;

var _utils = require("./utils");

const listKeys = baseInputs => async ({
  namespaceId = '',
  limit = _utils.MAX_KEYS_LIMIT,
  cursor = undefined,
  prefix = undefined
} = {}) => {
  (0, _utils.checkLimit)(limit);
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const nsId = (0, _utils.getNamespaceId)(baseInputs, namespaceId);
  const qs = (0, _utils.getQueryString)({
    limit,
    cursor,
    prefix
  });
  const path = (0, _utils.getPathWithQueryString)(`${basePath}/${nsId}/keys`, qs);
  const method = 'GET';
  const options = {
    method,
    host,
    path,
    headers
  };
  return (0, _utils.httpsReq)(options);
};

exports.listKeys = listKeys;

const listAllKeys = baseInputs => async ({
  namespaceId = '',
  prefix = undefined,
  limit = _utils.MAX_KEYS_LIMIT
} = {}) => {
  (0, _utils.checkLimit)(limit);
  const results = [];
  let result_info = null;
  let cursor = '';

  do {
    const data = await exports.listKeys(baseInputs)({
      limit,
      namespaceId,
      prefix,
      cursor
    });
    const {
      success,
      result
    } = data;
    success && result.forEach(x => results.push(x));
    ({
      result_info
    } = data);
    ({
      cursor
    } = result_info);
  } while (result_info && result_info.cursor);

  return {
    success: true,
    result: results,
    result_info: {
      count: results.length
    }
  };
};

exports.listAllKeys = listAllKeys;

const listNamespaces = baseInputs => async ({
  page = 1,
  per_page = 50
} = {}) => {
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const qs = (0, _utils.getQueryString)({
    page,
    per_page
  });
  const path = (0, _utils.getPathWithQueryString)(basePath, qs);
  const method = 'GET';
  const options = {
    method,
    host,
    path,
    headers
  };
  return (0, _utils.httpsReq)(options);
};

exports.listNamespaces = listNamespaces;

const writeKey = baseInputs => async ({
  key,
  value,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined
}) => {
  (0, _utils.checkKeyValue)(key, value);
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const nsId = (0, _utils.getNamespaceId)(baseInputs, namespaceId);
  const qs = (0, _utils.getQueryString)({
    expiration,
    expiration_ttl
  });
  const keyPath = `${basePath}/${nsId}/values/${key}`;
  const path = (0, _utils.getPathWithQueryString)(keyPath, qs);
  const method = 'PUT';
  const putHeaders = { ...headers,
    'Content-Type': 'text/plain',
    'Content-Length': value.length
  };
  const options = {
    method,
    host,
    path,
    headers: putHeaders
  };
  return (0, _utils.httpsReq)(options, value);
};

exports.writeKey = writeKey;

const readKey = baseInputs => async ({
  key,
  namespaceId = ''
}) => {
  (0, _utils.checkKey)(key);
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const nsId = (0, _utils.getNamespaceId)(baseInputs, namespaceId);
  const path = `${basePath}/${nsId}/values/${key}`;
  const method = 'GET';
  const options = {
    method,
    host,
    path,
    headers
  };
  return (0, _utils.httpsReq)(options);
};

exports.readKey = readKey;

const deleteKey = baseInputs => async ({
  key,
  namespaceId = ''
}) => {
  (0, _utils.checkKey)(key);
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const nsId = (0, _utils.getNamespaceId)(baseInputs, namespaceId);
  const path = `${basePath}/${nsId}/values/${key}`;
  const method = 'DELETE';
  const options = {
    method,
    host,
    path,
    headers
  };
  return (0, _utils.httpsReq)(options);
};

exports.deleteKey = deleteKey;

const writeMultipleKeys = baseInputs => async ({
  keyValueMap,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined
}) => {
  (0, _utils.checkKeyValueMap)(keyValueMap);
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const nsId = (0, _utils.getNamespaceId)(baseInputs, namespaceId);
  const qs = (0, _utils.getQueryString)({
    expiration,
    expiration_ttl
  });
  const bulkPath = `${basePath}/${nsId}/bulk`;
  const path = (0, _utils.getPathWithQueryString)(bulkPath, qs);
  const method = 'PUT';
  const bodyArray = Object.entries(keyValueMap).map(([key, value]) => ({
    key,
    value
  }));
  const body = JSON.stringify(bodyArray);
  const putHeaders = { ...headers,
    'Content-Type': 'application/json',
    'Content-Length': body.length
  };
  const options = {
    method,
    host,
    path,
    headers: putHeaders
  };
  return (0, _utils.httpsReq)(options, body);
};

exports.writeMultipleKeys = writeMultipleKeys;

const deleteMultipleKeys = baseInputs => async ({
  keys,
  namespaceId = ''
}) => {
  (0, _utils.checkKeys)(keys);
  const {
    host,
    basePath,
    headers
  } = baseInputs;
  const nsId = (0, _utils.getNamespaceId)(baseInputs, namespaceId);
  const path = `${basePath}/${nsId}/bulk`;
  const method = 'DELETE';
  const body = JSON.stringify(keys);
  const deleteHeaders = { ...headers,
    'Content-Type': 'application/json',
    'Content-Length': body.length
  };
  const options = {
    method,
    host,
    path,
    headers: deleteHeaders
  };
  return (0, _utils.httpsReq)(options, body);
};

exports.deleteMultipleKeys = deleteMultipleKeys;
const METHODS = {
  listKeys,
  listAllKeys,
  readKey,
  writeKey,
  writeMultipleKeys,
  deleteKey,
  deleteMultipleKeys,
  listNamespaces
};
exports.METHODS = METHODS;