roguemap-parse-stream
=====================

This module is for parsing text maps in which each character represents something at a coordinate indicated by which text column and row it is in. For example:

    ........ttt.......
    ..hthtttt.....h...
    ...htt.t....t.h...
    ....tt.h....tbtt..
    ..b.tt...tb...t...
    ..h..t....h..tt...
    hh.b.th.tt...tb.h.
    .ttb...tt....tt.h.
    .ttb........h.t...
    ..thb.t.....ttt...
    ....b..tthttt...t.
    .......bttt.......

The module creates a [through stream](https://github.com/rvagg/through2) that reads the map via a stream of text chunks and writes out "cell objects", each of which contains a key and a zero-indexed coordinate, like so:

    {
      key: 'b',
      coords: [4, 10]
    }

Installation
------------

    npm install roguemap-parse-stream

Usage
-----

Load the parser stream factory from the module.

    var parserStreamFactory = require('roguemap-parse-stream');

Create a stream to read the map from a text file.

    var fs = require('fs');
    var fileStream = fs.createReadStream('map.txt');  

Create a new parser stream to parse the text from that stream.

    var parserStream = parserStreamFactory();

Set up a writable stream to respond to parserStream's `data` events by do using the cell objects to create 'entities'.

    var Writable = require('stream').Writable;
    var yourStream = Writable({objectMode: true});
    yourStream._write = function doSomethingWithMapACell(cell, enc, next) {
      var entity = createEntityForKey(cell.key);
      entity.location = cell.coords;
    };

Plug the file stream into the parser stream and plug the parser stream into your stream.

    fileStream.pipe(parserStream);
    parserStream.pipe(yourStream);

Now an entity will be created for each character in the map.

License
-------

MIT.
