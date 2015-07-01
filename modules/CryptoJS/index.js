folderPath	= File(module.filename).parent.path;

include( folderPath + './hmac-sha1.js' );
include( folderPath + './hmac-sha256.js' );
include( folderPath + './hmac-sha512.js' );

module.exports	= CryptoJS;