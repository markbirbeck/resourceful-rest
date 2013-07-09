'use strict';

var util = require('util');


/**
 * Get the base engine:
 */

var base = require('resourceful-base-engine');

/**
 * Create a REST engine:
 */

var Rest = function Rest(config){
  config.protocol = 'rest';

  /**
   * Call the constructor of the base engine:
   */

  Rest.super_.call(this, config);


  /**
   * The REST requests will be handled by 'request':
   */

  this.connection = require('request');
};


/**
 * Inherit from the base engine:
 */

util.inherits(Rest, base.BaseEngine);


/**
 * Now override the request method:
 */

Rest.prototype.request = function(method, id, doc, callback){
  var body = null
    , err = null
    , self = this
    , url;

  switch (method){
  case 'get':
    url = this.uri + id;
    if (this.connection){
      return this.connection({
        'method': 'get'
      , 'url': url
      , 'json': {}
      }, function (err, res, body){
        if (err){
          throw new Error(err);
        }
        if (res.statusCode !== 200){
          callback(new Error('Failed to get ' + url + ' [' +
            res.statusCode + ']'));
        } else {
          if (self.childNode){
            body = body[self.childNode];
          }
          body.status = 200;
          callback(null, body);
        }
      });
    } else {
      err = 'No get method.';
      body = { status: 404 };
    }
    break;

  case 'put':
    url = this.uri + id;
    if (this.connection){
      return this.connection.put(url, {'json': doc}, function (err, res, body){
        if (err){
          throw new Error(err);
        } else if (res.statusCode !== 201){
          callback(new Error('Failed to put: ' + url + ' [' + res.statusCode + ']'));
        } else {
          callback(err, body);
        }
      });
    } else {
      err = new Error('No put method.');
      body = { status: 500 };
    }
    break;

  default:
    err = new Error(util.format('No %s handler', method));
    break;
  }

  return callback(err, body);
};


/**
 * Allow a reference to resourceful to be patched in:
 */

exports.init = function init(resourcefulLib){
  base.register(resourcefulLib, 'Rest', Rest);
};
