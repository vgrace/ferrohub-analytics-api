var Connection = require('./connection');
var Channel = require('./channel');
var mongodb = require('mongodb');

/**
Copyright (C) 2012-2014 Scott Nelson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

https://github.com/scttnlsn/mubsub

**/

/**
 * Create connection.
 *
 * @see Connection
 * @return {Connection}
 * @api public
 */
module.exports = exports = function (uri, options) {
    return new Connection(uri, options);
};

/**
 * Mubsub version.
 *
 * @api public
 */
//exports.version = require('../package').version;

/**
 * Expose Connection constructor.
 *
 * @api public
 */
exports.Connection = Connection;

/**
 * Expose Channel constructor.
 *
 * @api public
 */
exports.Channel = Channel;

/**
 * Expose mongodb module.
 *
 * @api public
 */
exports.mongodb = mongodb;

