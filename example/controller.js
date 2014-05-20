function controller() {
  var renderer = createRenderer({
    rootSelector: '#tilemap .tileroot',
    scale: 0.2,
    averageRowSize: 80
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

  var batchesRenderered = 0;
  var callNextWithoutOverwhelmingBrowser = utils.space(function callNext(next) {
    ++batchesRenderered;
    console.log('batchesRenderered', batchesRenderered);
    next();
  }, 500);  

  function createCellRenderStream() {
    var writeStream = streampack.stream.Writable({objectMode: true});
    writeStream._write = function writeCells(cells, enc, next) {
      cells.forEach(setUpCellId);
      renderer.renderCells(cells);
      callNextWithoutOverwhelmingBrowser(next);
    };
    writeStream.end = function wrapUp() {
      console.log('Rendered it all!');
    }
    return writeStream;
  }

  function setUpCellId(cell) {
    cell.id = 'c' + cell.coords[0] + '-' + cell.coords[1];
  }

  var readStream = createXHRCharReadStream('bigmap.txt');
  var parserstream = streampack.createMapParserStream({
    batchSize: 2500
  });
  var renderStream = createCellRenderStream();

  readStream.pipe(parserstream);
  parserstream.pipe(renderStream);

  return {
    parserstream: parserstream
  };
}

var theController = controller();
