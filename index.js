/**
 * Created by Aaron on 7/9/2015.
 */

var Promise = require( 'bluebird' );
var yield_handler = require( './build/yield_handler.js' );

Promise.coroutine.addYieldHandler( yield_handler.toPromise );

module.exports = yield_handler;
