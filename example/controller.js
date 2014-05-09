function controller() {
  var renderer = createRenderer({
    rootSelector: '#tilemap .tileroot',    
  });

  var cellsReceived = [];

  function createXHRCharReadStream() {
    var readStream = streampack.stream.Readable({objectMode: true});

    function pushCharsFromChunk(chunk) {
      for (var chunkIndex = 0; chunkIndex < chunk.length; ++chunkIndex) {
        var result = readStream.push(chunk[chunkIndex]);
        if (!result) {
          return result;
        }
      }
      return true;
    };

    var xhr = null;
    readStream._read = function readFromXHR(size) {
      if (!xhr) {
        xhr = utils.makeRequest({
          url: 'megahyrulewest.txt',
          method: 'GET',
          mimeType: 'text/plain',
          onData: function onData(data) {
            pushCharsFromChunk(data);
          },
          done: function useResponse(error, text) {
            readStream.push(null);
          }
        });
      }
    }

    return readStream;
  }

  function createCellRenderStream() {
    var writeStream = streampack.stream.Writable({objectMode: true});
    writeStream._write = function writeCell(cell, enc, next) {
      cell.id = 'cell-' + cell.coords[0] + '-' + cell.coords[1];
      setTimeout(function doCellWritingWork() {
        renderer.renderNewCell(cell);
        next();
      },
      0);
    };
    writeStream.end = function wrapUp() {
      if (cellsReceived.length > 0) {
        renderer.renderNewCells(cellsReceived);        
      }
    }
    return writeStream;
  }

  var readStream = createXHRCharReadStream();
  var parserstream = streampack.createMapParserStream();
  var renderStream = createCellRenderStream();
  // debugger;
  readStream.pipe(parserstream);
  parserstream.pipe(renderStream);

  return {
    parserstream: parserstream
  };
}

var theController = controller();
