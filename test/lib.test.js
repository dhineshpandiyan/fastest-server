'use strict';

const FastestServer = require('../lib');
const assert = require('assert');
const { stat } = require('fs');

describe('FastestServer', () => {

  describe('FastestServer.get()', () => {

    it('Should return expected result', async () => {
      const expectedStatsProperties = ['host', 'response', 'timeElapsed'];
      const hosts = [
        '127.0.0.1',
        'github.com',
        'google.com',
      ];
      const { fastest, stats } = await FastestServer.get(hosts);

      assert(hosts.indexOf(fastest) > -1);
      assert(Array.isArray(stats));
      stats.forEach((host) => {
        Object.keys(host).forEach((key) => assert(expectedStatsProperties.indexOf(key) > -1));
      });
    }).timeout(10000);

    it('Should throw error if hosts is not an array', async () => {
      try {
        await FastestServer.get('somedomain.com');
        assert.fail('Should throw expected exception');
      } catch ({ message }) {
        assert.equal(message, 'hosts must be an array');
      }
    });

    it('Should throw error if host is not a string', async () => {
      try {
        await FastestServer.get([1234]);
        assert.fail('Should throw expected exception');
      } catch ({ message }) {
        assert.equal(message, 'host must be string');
      }
    });

  });

});
