'use strict';

var should = require('should');

/**
 * Add the REST engine to resourceful:
 */

var resourceful = require('resourceful');

require('../lib/resourceful-rest').init(resourceful);

describe('Companies House', function(){
  var companiesHouse;

  before(function(done){

    /**
     * Create a class that's connected to the Companies House API:
     */

    companiesHouse = resourceful.define('company', function (){
      this.restful = true;

      this.use('Rest', {
        'uri': 'data.companieshouse.gov.uk/doc'
      , 'prefix': 'http://'
      , 'childNode': 'primaryTopic'
      });

      done();
    });
  });

  it('should get a single company by id', function(done){
    var id = '06675651';

    companiesHouse.get(id, function(err, company){
      should.not.exist(err);
      should.exist(company);
      company.should.have.property('CompanyName', '007 HOTELS LIMITED');
      company.should.have.property('CompanyNumber', id);
      done();
    });
  });
});
