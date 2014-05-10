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
      checkStream._write = function checkMapCells(cells, enc, next) {
        var cell = cells[0];
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
      var parserStream = parserStreamFactory({
        batchSize: 1
      });

      fileStream.pipe(parserStream);
      parserStream.pipe(checkStream);
      
      parserStream.on('end', function onParseEnd() {
        this.verifyAsJSON(cellsReceived);
        testDone();
      }
      .bind(this));
    }
  );

  test('A cell event should be fired for every 10 characters in the map', 
    function testReadingMapInGroupsOften(testDone) {
      var Writable = require('stream').Writable;
      var checkStream = Writable({objectMode: true});
      var atLeastOneOfTheDataEventsHadTenCells = false;

      checkStream._write = function checkMapCells(cells, enc, next) {
        assert.ok(Array.isArray(cells));
        if (!atLeastOneOfTheDataEventsHadTenCells) {
          atLeastOneOfTheDataEventsHadTenCells = (cells.length === 10);
        }

        cells.forEach(function checkMapCell(cell) {
          assert.equal(typeof cell, 'object');
          assert.ok(Array.isArray(cell.coords));
          assert.equal(typeof cell.coords[0], 'number');
          assert.equal(typeof cell.coords[1], 'number');
          assert.equal(typeof cell.key, 'string');
        })
        next();
      };
      var fileStream = fs.createReadStream(
        __dirname + '/data/' + 'background_layer_map.txt',
        {encoding: 'utf8'}
      );
      var parserStream = parserStreamFactory({
        batchSize: 10
      });

      fileStream.pipe(parserStream);
      parserStream.pipe(checkStream);

      parserStream.on('end', function onParseEnd() {
        assert.ok(atLeastOneOfTheDataEventsHadTenCells);
        testDone();
      }
      .bind(this));
    }
  );

});
