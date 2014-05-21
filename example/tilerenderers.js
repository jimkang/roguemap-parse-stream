function createTileRenderers() {
  function renderWaterToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'water'
    });
  }

  function renderPlainToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'plain'
    });
    
    cellRendition.append('circle').attr({
      cx: size/4,
      cy: size/4,
      r: size/8,
      fill: 'green'
    });
  }

  var trianglePathData = d3.svg.symbol().type('triangle-up').size(0.5);

  function renderMountainToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'mountain'
    });

    cellRendition.append('path')
      .attr('d', trianglePathData)
      .attr('transform', 'translate(0.5, 0.5)')
      .attr('fill', 'hsl(0, 0%, 80%)');
  }

  function renderForestToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'forest'
    });

    cellRendition.append('path')
      .attr('d', trianglePathData)
      .attr('transform', 'translate(0.5, 0.5)')
      .attr('fill', 'hsl(140, 50%, 60%)');
  }

  function renderTownToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'town'
    });
    
    cellRendition.append('rect').attr({
      x: 0,
      y: size/2,
      width: size/3,
      height: size/3,
      fill: 'orange'
    });

    cellRendition.append('rect').attr({
      x: size/2,
      y: size/4,
      width: size/3,
      height: size/3,
      fill: 'yellow'
    });
  }

  function renderCaveToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'cave'
    });

    cellRendition.append('rect').attr({
      x: size/3,
      y: size/4,
      width: size * 0.5,
      height: size * 0.7,
      fill: '#222'
    });
  }

  function renderVolcanoToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'volcano'
    });

    cellRendition.append('path')
      .attr('d', trianglePathData)
      .attr('transform', 'translate(0.5, 0.5)')
      .attr('fill', 'hsl(10, 60%, 80%)');
  }

  function renderSwampToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'swamp'
    });
  }


  function renderRoadToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'cave'
    });
 
    cellRendition.append('rect').attr({
      x: size/2,
      y: 0,
      width: size/4,
      height: size,
      fill: '#888'
    });
  }

  function renderGlacierToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'glacier'
    });
  }

  return {
    w: renderWaterToTile,
    p: renderPlainToTile,
    m: renderMountainToTile,
    f: renderForestToTile,
    t: renderTownToTile,
    c: renderCaveToTile,
    v: renderVolcanoToTile,
    s: renderSwampToTile,
    r: renderRoadToTile,
    g: renderGlacierToTile
  };
}
