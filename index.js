/*
 * JWT
 */

var base64url	= require('./modules/base64url');

/***************************************************************************************
 *
 * EXPORTED METHODS AREA
 *
 ***************************************************************************************/

exports.decode	= function ( jwt , secret ) {
	
	var response	= {};
	var tempo		= { jwt : jwt };
	var rSignature	= null;
	var cSignature	= null;
	
	if ( ! validate( tempo ) ) {
	
		response.verified	= false;
		
		return response;
	
	};
	
	response.header		= tempo[ 'header' ];
	response.payload	= tempo[ 'payload' ];
	rSignature			= tempo[ 'signature' ]; //received
		
	try{
		
		cSignature	= getSignature( response.header , response.payload , secret ).signature; //calculated
		
		response.verified	= ( cSignature === rSignature );
		
	} catch ( e ) {
	
		response.verified	= false;
	
		return response;
	
	};
    
    return response;
    
};

exports.verify	= exports.decode;

exports.sign	= function( header , claims , secret ){
	
	var jwt	= getSignature( header , claims , secret ).jwt;
	
	return jwt;
	
};

/***************************************************************************************
 *
 * INTERNAL METHODS AREA
 *
 ***************************************************************************************/


function getSignature( header , claims , secret ){
	
	var algoName	= header.alg;	
	var jwa			= require( './modules/jwa' );
	var algo		= jwa( algoName );
	
	var h			= base64url.encode( JSON.stringify( header ) );
	var c			= base64url.encode( JSON.stringify( claims ) );
	var input		= [ h , c ].join( '.' );
	var cSignature	= base64url.fromBase64( algo.sign( input , secret ) ); //calculated
	
	return {
		
		signature : cSignature,
		
		jwt : [ input , cSignature ].join( '.' )		
		
	};

};

function validate( input ) {
	
	var parts	= null;
	var e		= null;
	
	if ( ! input.jwt ){
	
		return false;
	
	};
	
	parts		= input.jwt.split( '.' );
	
	try {
	
		input.header	= JSON.parse( base64url.decode( parts[ 0 ] ) );
		    
		input.payload	=  JSON.parse( base64url.decode( parts[ 1 ] ) );
		
		input.signature	= parts[ 2 ];
	    
	} catch ( e ) {
	
		return false;
	
	};
	
	if ( ! parts[ 2 ] ) {
	
		return false;
	
	};
	
	/*
	 * Check that the algo is supported
	 */
	if ( ['HS256','HS512'].indexOf( input.header.alg ) > -1 ) {
	
		return true;
	
	};	
	
	return false;

};
