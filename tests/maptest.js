var assert = require('assert');
var parserStreamFactory = require('../mapparserstream');
var _ = require('lodash');
var fs = require('fs');

require('approvals').mocha(__dirname + '/approvals');

suite('Read basic map', function basicMapSuite() {
  test('A cell event should be fired for each character in the map', 
    function testReadingMap(testDone) {
      var cellsReceived = [];

      var Writable = require('stream').Writable;
      var checkStream = Writable({objectMode: true});
      checkStream._write = function checkMapCell(cell, enc, next) {
        assert.equal(typeof cell, 'object');
        assert.ok(Array.isArray(cell.coords));
        assert.equal(typeof cell.coords[0], 'number');
        assert.equal(typeof cell.coords[1], 'number');
        assert.equal(typeof cell.key, 'string');
        cellsReceived.push(cell);
        next();
      };
      var fileStream = fs.createReadStream(
        __dirname + '/data/' + 'background_layer_map.txt', 
        {encoding: 'utf8'}
      );
      var parserStream = parserStreamFactory();

      fileStream.pipe(parserStream);
      parserStream.pipe(checkStream);
      
      parserStream.on('end', function onParseEnd() {
        this.verifyAsJSON(cellsReceived);
        testDone();
      }
      .bind(this));
    }
  );

});
