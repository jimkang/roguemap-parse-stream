function controller() {
  var tileRoot = d3.select('#tilemap .tileroot');
  tileRoot.append('rect').attr({
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'green'
  });

  var cellsReceived = [];

  function createMapWriteStream() {
    var mapWriteStream = streampack.stream.Writable({objectMode: true});
    mapWriteStream._write = function writeMapCell(cell, enc, next) {
      cellsReceived.push(cell);
      next();
    };
    return mapWriteStream;
  }

  function createMockReadStream() {
    var mockReadStream = streampack.stream.Readable({objectMode: true});
    var mockData = ['a', 'b', 'c', 'd', 'e', 'f', '\n', 'g', 'h', 'i', 'j', 'k'];
    var index = 0;
    mockReadStream._read = function readChar() {
      if (index < mockData.length) {
        this.push(mockData[index]);
        index += 1;
      }
      else {
        this.push(null);
      }
    };
    return mockReadStream;
  }

  var readStream = createMockReadStream();
  var parserstream = streampack.createMapParserStream();
  var mapwriteStream = createMapWriteStream();
  readStream.pipe(parserstream);
  parserstream.pipe(mapwriteStream);

  parserstream.on('end', function onParseEnd() {
    console.log(cellsReceived);
  }
  .bind(this));


  return {
    parserstream: parserstream
  };
}

var theController = controller();
