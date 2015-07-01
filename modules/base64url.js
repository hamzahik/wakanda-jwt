/*
 * Adapted from : https://github.com/brianloveswords/base64url
 */
function fromBase64(base64string) {
  return (
    base64string
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  );
};

function toBase64(base64UrlString) {
  if (Buffer.isBuffer(base64UrlString))
    base64UrlString = base64UrlString.toString();

  const b64str = padString(base64UrlString)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  return b64str;
};

function padString(string) {
  const segmentLength = 4;
  const stringLength = string.length;
  const diff = string.length % segmentLength;
  if (!diff)
    return string;
  var position = stringLength;
  var padLength = segmentLength - diff;
  const paddedStringLength = stringLength + padLength;
  const buffer = new Buffer(paddedStringLength);
  buffer.write(string);
  while (padLength--)
    buffer.write('=', position++);
  return buffer.toString();
};

function decodeBase64Url(base64UrlString, encoding) {
  encoding	= encoding || 'utf8';
  return new Buffer(toBase64(base64UrlString), 'base64').toString(encoding);
};

function base64url(stringOrBuffer, encoding) {
  encoding	= encoding || 'utf8';
  return fromBase64(new Buffer(stringOrBuffer, encoding).toString('base64'));
};

function toBuffer(base64string) {
  return new Buffer(toBase64(base64string), 'base64');
};

var B64 = {};

base64url.toBase64		= toBase64;
base64url.fromBase64	= fromBase64;
base64url.decode		  = decodeBase64Url;
base64url.encode		  = base64url;
base64url.toBuffer		= toBuffer;
base64url.base64url		= base64url;

module.exports = base64url;