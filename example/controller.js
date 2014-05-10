function controller() {
  var renderer = createRenderer({
    rootSelector: '#tilemap .tileroot',    
  });

  var cellsReceived = [];

  function createXHRCharReadStream() {
    var readStream = streampack.stream.Readable({encoding: 'utf8'});

    var xhr = null;
    var buffer = [];
    var paused = false;
    var xhrDone = false;

    readStream._read = function readFromXHR(size) {
      paused = false;

      if (!xhr) {
        xhr = utils.makeRequest({
          url: 'megahyrulewest.txt',
          method: 'GET',
          mimeType: 'text/plain',
          onData: function onData(data) {
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

  var callNextWithoutOverwhelmingBrowser = utils.space(function callNext(next) {
    next();
  }, 500);  

  function createCellRenderStream() {
    var writeStream = streampack.stream.Writable({objectMode: true});
    writeStream._write = function writeCells(cells, enc, next) {
      renderer.renderNewCells(cells);
      callNextWithoutOverwhelmingBrowser(next);
    };
    writeStream.end = function wrapUp() {
      console.log('Rendered it all!');
    }
    return writeStream;
  }

  var readStream = createXHRCharReadStream();
  var parserstream = streampack.createMapParserStream({
    batchSize: 200
  });
  var renderStream = createCellRenderStream();

  readStream.pipe(parserstream);
  parserstream.pipe(renderStream);

  return {
    parserstream: parserstream
  };
}

var theController = controller();
