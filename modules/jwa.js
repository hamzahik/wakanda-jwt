/*
 * Adapted from : https://github.com/brianloveswords/node-jwa
 */
 
const CryptoJS	= require('./CryptoJS');

const MSG_INVALID_ALGORITHM	= '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512" and "none".'
const MSG_INVALID_SECRET	= 'secret must be a string or buffer';
const MSG_INVALID_KEY		= 'key must be a string or buffer';

function typeError(template) {
  const args = [].slice.call(arguments, 1);
  var msg	= template;
  for ( var i = 0 ; i < args.length ; ++i ){
  
  	msg.replace( '%s' , args[ i ] );
  
  };
  return new TypeError( msg );
}

function bufferOrString(obj) {
  return Buffer.isBuffer(obj) || typeof obj === 'string';
}

function normalizeInput(thing) {
  if (!bufferOrString(thing))
    thing = JSON.stringify(thing);
  return thing;
}

function createHmacSigner(bits) {
	
  return function sign(thing, secret) {
  	
    if (!bufferOrString(secret))
      throw typeError(MSG_INVALID_SECRET);
      
    thing = normalizeInput(thing);
    
    var hmac	= CryptoJS.algo.HMAC.create(CryptoJS.algo['SHA' + bits], secret);
    var sig		= hmac.update(thing).finalize();

    return ( new Buffer( sig.toString() , 'hex' ) ).toString('base64');
    
  }
}

function createHmacVerifier( bits ) {
  return function verify( thing, signature, secret ) {
    const computedSig = createHmacSigner( bits )( thing , secret );
    return ( signature === computedSig ) ;
  }
}

module.exports = function jwa(algorithm) {
  const signerFactories = {
    hs: createHmacSigner
  };
  const verifierFactories = {
    hs: createHmacVerifier
  };

  const match = algorithm.match(/(HS)(256|512)?/i);
  if (!match)
    throw typeError(MSG_INVALID_ALGORITHM, algorithm);
  const algo = match[1].toLowerCase();
  const bits = match[2];

  return {
    sign: signerFactories[algo](bits),
    verify: verifierFactories[algo](bits),
  }
};
