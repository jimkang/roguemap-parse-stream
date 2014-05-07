function controller() {
  var renderer = createRenderer({
    rootSelector: '#tilemap .tileroot',    
  });

  var cellsReceived = [];

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
  readStream.pipe(parserstream);

  parserstream.on('end', function logCells() {
    console.log(cellsReceived);
  });

  parserstream.on('data', function updateMap(cell) {
    cell.id = 'cell-' + cell.coords[0] + '-' + cell.coords[1];
    cellsReceived.push(cell);
    renderer.renderCells(cellsReceived);
  });

  return {
    parserstream: parserstream
  };
}

var theController = controller();
