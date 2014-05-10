var Transform = require('stream').Transform;

function createMapParserStream(opts) {
  var batchSize = (opts && opts.batchSize) ? opts.batchSize : 10;
  var x = 0;
  var y = 0;
  var cells = [];

  function chunkToMapEvents(chunk, enc, callback) {
    for (var i = 0; i < chunk.length; ++i) {
      var char = chunk[i];
      if (char === '\n') {
        y += 1;
        x = 0;
      }
      else {
        cells.push({
          key: char,
          coords: [x, y]
        });
        x += 1;

        if (cells.length === batchSize) {
          // Ship it.
          stream.push(cells.slice());
          cells.length = 0;
        }
      }
    }
    callback();
  }

  function postRemainingCells(callback) {
    if (cells.length > 0) {
      this.push(cells);
    }
    callback();
  }

  var stream = new Transform({objectMode: true});

  stream._transform = chunkToMapEvents;
  stream._flush = postRemainingCells;
  return stream;
}

module.exports = createMapParserStream;

