function createRenderer(opts) {
  if (!opts.spaceFactor) {
    opts.spaceFactor = 50;
  }

  var accessors = createAccessors({
    simpleAccessors: ['id', 'key']
  });

  var tileRoot = d3.select(opts.rootSelector);

  function renderNewCells(cells) {
    var cellRenditions = tileRoot.selectAll('.new').data(cells, accessors.id);

    var newRenditions = cellRenditions.enter().append('g');
    newRenditions.classed('cell', true);
    
    newRenditions.append('rect');
    newRenditions.append('text').attr({
      x: '1em',
      y: '1em',
      dy: '0.35em',
      'text-anchor': 'middle'
    });

    newRenditions.selectAll('rect').attr({
      width: opts.spaceFactor,
      height: opts.spaceFactor,
      fill: 'blue'
    });
    newRenditions.attr('transform', function composeTransform(d) {
      return 'translate(' + d.coords[0] * opts.spaceFactor + ',' + 
        d.coords[1] * opts.spaceFactor + ')';
    });

    newRenditions.selectAll('text').text(accessors.key);

    d3.select('#tilemap').attr('height', 
      d3.selectAll('.cell')[0].length / 76 * opts.spaceFactor/5);
  }

  function renderNewCell(cell) {
    var rendition = tileRoot.append('g');
    rendition.datum(cell);
    rendition.attr('class', 'cell');
    
    rendition.append('rect').attr({
      x: cell.coords[0] * opts.spaceFactor,
      y: cell.coords[1] * opts.spaceFactor,
      width: opts.spaceFactor,
      height: opts.spaceFactor,
      fill: 'blue'
    });

    rendition.append('text').text(cell.key).attr({
      x: (cell.coords[0] + 0.5) * opts.spaceFactor,
      y: (cell.coords[1] + 0.5) * opts.spaceFactor,
      dy: '0.35em',
      'text-anchor': 'middle'
    });

    d3.select('#tilemap').attr('height', 
      d3.selectAll('.cell')[0].length / 76 * opts.spaceFactor * 0.2
    );
  }

  return {
    renderNewCells: renderNewCells,
    renderNewCell: renderNewCell
  };
}