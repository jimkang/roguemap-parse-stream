var assert = require('assert');
var parserStreamFactory = require('../mapparserstream');
var _ = require('lodash');
var fs = require('fs');

suite('Read basic map', function basicMapSuite() {
  test('A cell event should be fired for each character in the map', 
    function testReadingMap(testDone) {
      var cellsReceived = [];

      var Writable = require('stream').Writable;
      var checkStream = Writable({objectMode: true});
      checkStream._write = function checkMapCell(cell, enc, next) {
        // console.log(cell);
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
        {
          // objectMode: true,
          encoding: 'utf8'
        }
      );
      var parserStream = parserStreamFactory();

      fileStream.pipe(parserStream);
      parserStream.pipe(checkStream);
      
      parserStream.on('end', function onParseEnd() {
        // TODO: Record output for approvals.
        console.log('Checked ', cellsReceived.length, 'cells.');
        testDone();
      });


      // testStream? assert on each chunk? Wait until it's all done?
      // Is there even a point to this kind of map-reading being streaming?
      // Can you do anything with a partial map?
      //  You can at least display it.
    }
  );

});
