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
  var currentMapHeight = 1000;

  function renderNewCells(cells) {
    cells.forEach(renderNewCell);

    cellsRenderedCount += cells.length;
    var neededHeight = cellsRenderedCount / 76 * opts.spaceFactor/5;
    if (neededHeight > currentMapHeight) {
      currentMapHeight += 1000;
      tileMap.attr('height', currentMapHeight);
    }
  }

  function renderNewCell(cell) {
    var rendition = tileRoot.append('g')
    
    rendition.append('rect')
      .attr({
        x: opts.spaceFactor * cell.coords[0],
        y: opts.spaceFactor * cell.coords[1],        
        width: opts.spaceFactor,
        height: opts.spaceFactor,
        class: cell.key
      });

    rendition.append('text')
      .text(cell.key)
      .attr({
        x: opts.spaceFactor * (cell.coords[0] + 0.5),
        y: opts.spaceFactor * (cell.coords[1] + 0.5), 
      });        
  }

  return {
    renderNewCells: renderNewCells,
    renderNewCell: renderNewCell
  };
}