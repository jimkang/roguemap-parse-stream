function createRenderer(opts) {
  if (!opts.spaceFactor) {
    opts.spaceFactor = 20;
  }

  var accessors = createAccessors({
    simpleAccessors: ['id']
  });

  var tileRoot = d3.select(opts.rootSelector);

  function renderCells(cells) {
    var cellRenditions = tileRoot.selectAll('.cell').data(cells, accessors.id);
    var newRenditions = cellRenditions.enter().append('g');
    newRenditions.classed('cell');
    newRenditions.append('rect');
    newRenditions.append('text');

    cellRenditions.selectAll('rect').attr({
      width: 1,
      height: 1,
      fill: 'blue'
    });
    cellRenditions.attr('transform', function composeTransform(d) {
      return 'translate(' + d.coords[0] * opts.spaceFactor + ',' + 
        d.coords[1] * opts.spaceFactor + 
        ') scale(' + opts.spaceFactor + ')';
    });
  }

  return {
    renderCells: renderCells
  };
}