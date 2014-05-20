function createRenderer(opts) {
  if (!opts.spaceFactor) {
    opts.spaceFactor = 50;
  }

  var accessors = createAccessors({
    simpleAccessors: ['id', 'key']
  });

  var tileRoot = d3.select(opts.rootSelector);
  var tileMap = d3.select('#tilemap');
  var cellsRenderedCount = 0;
  var rowOffset = 0;
  var rowSize = 80;
  var currentMapHeight = 1000;
  var tileRenderers = createTileRenderers();

  function renderCells(cells) {
    rowOffset = -cellsRenderedCount/rowSize;

    var cellRenditions = tileRoot.selectAll('.cell')
      .data(cells, accessors.id);

    var newCellRenditions = cellRenditions.enter()
      .append('g').classed('cell', true);

    newCellRenditions.append('rect').attr({
      width: opts.spaceFactor,
      height: opts.spaceFactor
    });

    newCellRenditions.append('text');

    cellRenditions.each(updateCell);

    cellRenditions.exit().remove();

    cellsRenderedCount += cells.length;
    // var neededHeight = cellsRenderedCount / opts.averageRowSize * 
    //   opts.spaceFactor * opts.scale;

    // if (neededHeight > currentMapHeight) {
    //   currentMapHeight += 1000;
    //   tileMap.attr('height', currentMapHeight);
    // }
  }

  function updateCell(cell) {
    var cellRendition = d3.select(this);
    
    var tile = cellRendition.select('rect')
      .attr({
        x: opts.spaceFactor * cell.coords[0],
        y: opts.spaceFactor * (cell.coords[1] + rowOffset)
      });

    tileRenderers[cell.key](cell, tile, cellRendition, opts.spaceFactor);

    cellRendition.select('text')
      .text(cell.key)
      .attr({
        x: opts.spaceFactor * (cell.coords[0] + 0.5),
        y: opts.spaceFactor * (cell.coords[1] + 0.5 + rowOffset)
      });
  }

  return {
    renderCells: renderCells
  };
}