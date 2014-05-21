function controller() {
  var rowSize = 80;
  var rowsToRenderPerUpdate = 20;

  var renderer = createRenderer({
    rootSelector: '#tilemap .tileroot',
    scale: 0.2,
    averageRowSize: rowSize
  });

  var cellsReceived = [];

  function createXHRCharReadStream(url) {
    var readStream = streampack.stream.Readable({encoding: 'utf8'});

    var xhr = null;
    var buffer = [];
    var paused = false;
    var xhrDone = false;
    var dataCount = 0;

    readStream._read = function readFromXHR(size) {
      paused = false;
      if (!xhr) {
        xhr = utils.makeRequest({
          url: url,
          method: 'GET',
          mimeType: 'text/plain',
          onData: function onData(data) {
            console.log('data.length', data.length);
            if (dataCount > 1) {
              return;
            }

            dataCount += 1;              
            if (paused) {
              buffer.push(data);
            }
            else {
              paused = !readStream.push(data);
              if (paused) {
                console.log('XHRReadStream is paused!');
              }
            }
          },
          done: function onDone(error, text) {
            xhrDone = true;
            if (buffer.length < 1) {
              readStream.push(null);
            }
          }
        });
      }

      pushFromBuffer();
      if (xhrDone && buffer.length < 1) {
        readStream.push(null);
      }
    }

    function pushFromBuffer() {
      while (!paused && buffer.length > 0) {
        paused = !readStream.push[buffer.shift()];
      }
    }

    return readStream;
  }

  var lastCellsRendered = [];
  var rowsRendered = 0;

  function renderCellStreamChunk(cells, enc, next) {
    cells.forEach(setUpCellId);
    var numberOfNewRows = cells.length/rowSize;
    var yOffset = numberOfNewRows - rowsRendered;
    yOffset = yOffset > 0 ? 0 : yOffset;
    renderer.renderCells(lastCellsRendered.concat(cells), yOffset);
    lastCellsRendered = cells;
    rowsRendered += lastCellsRendered.length/rowSize;
    console.log('rowsRendered', rowsRendered);

    next();
  }

  var renderWhenTheBrowserHasAChanceToBreathe = utils.space(
    renderCellStreamChunk, 2000);  

  function createCellRenderStream() {
    var writeStream = streampack.stream.Writable({objectMode: true});
    writeStream._write = function writeCells(cells, enc, next) {
      renderWhenTheBrowserHasAChanceToBreathe(cells, enc, next);
    };
    writeStream.end = function wrapUp() {
    }
    return writeStream;
  }

  function setUpCellId(cell) {
    cell.id = 'c' + cell.coords[0] + '-' + cell.coords[1];
  }

  var readStream = createXHRCharReadStream('bigmap.txt');
  var parserstream = streampack.createMapParserStream({
    batchSize: rowSize * rowsToRenderPerUpdate
  });
  var renderStream = createCellRenderStream();

  readStream.pipe(parserstream);
  parserstream.pipe(renderStream);

  return {
    parserstream: parserstream
  };
}

var theController = controller();
