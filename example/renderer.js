function createRenderer(opts) {
  if (!opts.spaceFactor) {
    opts.spaceFactor = 50;
  }

  var accessors = createAccessors({
    simpleAccessors: ['id', 'key']
  });

  var tileRoot = d3.select(opts.rootSelector);

  function renderCells(cells) {
    var cellRenditions = tileRoot.selectAll('.cell').data(cells, accessors.id);
    var newRenditions = cellRenditions.enter().append('g');
    newRenditions.classed('cell', true);
    
    newRenditions.append('rect');
    newRenditions.append('text').attr({
      x: '1em',
      y: '1em',
      dy: '0.35em',
      'text-anchor': 'middle'
    });

    cellRenditions.selectAll('rect').attr({
      width: opts.spaceFactor,
      height: opts.spaceFactor,
      fill: 'blue'
    });
    cellRenditions.attr('transform', function composeTransform(d) {
      return 'translate(' + d.coords[0] * opts.spaceFactor + ',' + 
        d.coords[1] * opts.spaceFactor + ')';
    });

    cellRenditions.selectAll('text').text(accessors.key);
  }

  return {
    renderCells: renderCells
  };
}