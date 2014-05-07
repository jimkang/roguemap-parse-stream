var Transform = require('stream').Transform;

function createMapParserStream() {
  var x = 0;
  var y = 0;

  function chunkToMapEvents(chunk, enc, callback) {
    for (var i = 0; i < chunk.length; ++i) {
      var char = chunk[i];
      if (char === '\n') {
        y += 1;
        x = 0;
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

  var stream = new Transform({objectMode: true});
  stream._transform = chunkToMapEvents;
  return stream;
}

module.exports = createMapParserStream;

