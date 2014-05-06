var through2 = require('through2');

function createMapParserStream() {
  var x = 0;
  var y = 0;

  function chunkToMapEvents(chunk, enc, callback) {
    for (var i = 0; i < chunk.length; ++i) {
      var char = chunk[i];
      if (char === '\n') {
        y += 1;
      }
      else {
        this.push({
          key: char,
          coords: [x, y]
        });
        x += 1;
      }
    }
    callback();
  }

  return through2({objectMode: true}, chunkToMapEvents);
}

module.exports = createMapParserStream;

