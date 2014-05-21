function createRenderer(opts) {
  if (!opts.spaceFactor) {
    opts.spaceFactor = 14;
  }

  var accessors = createAccessors({
    simpleAccessors: ['id', 'key']
  });
  accessors.transform = function getTransform(d) {
    return 'translate(' 
      + d.coords[0] * opts.spaceFactor + ',' 
      + (d.coords[1] + rowOffset) * opts.spaceFactor 
      + ') scale(' + opts.spaceFactor + ')';
  }

  var tileRoot = d3.select(opts.rootSelector);
  var tileMap = d3.select('#tilemap');
  var cellsRenderedCount = 0;
  var rowOffset = 0;
  var rowSize = 80;
  var currentMapHeight = 1000;
  var tileRenderers = createTileRenderers();

  function renderCells(cells, yOffset) {
    rowOffset = yOffset;

    var cellRenditions = tileRoot.selectAll('.cell')
      .data(cells, accessors.id);

    var newCellRenditions = cellRenditions.enter()
      .append('g').classed('cell', true);

    newCellRenditions.append('rect').attr({
      x: 0,
      y: 0,
      width: 1,
      height: 1
    });

    newCellRenditions.append('text');

    cellRenditions.each(updateCell);

    cellRenditions.exit().remove();

    cellsRenderedCount += newCellRenditions.size();
  }

  function updateCell(cell) {
    var cellRendition = d3.select(this);
    cellRendition.attr('transform', accessors.transform);
    
    var tile = cellRendition.select('rect');
    tileRenderers[cell.key](cell, tile, cellRendition, 1.0);
  }

  return {
    renderCells: renderCells
  };
}