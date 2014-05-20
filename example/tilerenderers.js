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

  function renderMountainToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'mountain'
    });
    cellRendition.append('path')
      // .attr("transform", 'translate(' + size + "," + y(d.y) + ")"; })
      .attr('d', d3.svg.symbol().type('triangle-up'))
      .attr('fill', 'gray');
  }

  function renderForestToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'forest'
    });
    cellRendition.append('path')
      // .attr("transform", 'translate(' + size + "," + y(d.y) + ")"; })
      .attr('d', d3.svg.symbol().type('triangle-up'))
      .attr('fill', '#284');
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
      fill: 'brown'
    });

    cellRendition.append('rect').attr({
      x: size/2,
      y: size/4,
      width: size/3,
      height: size/3,
      fill: 'brown'
    });
  }

  function renderCaveToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'cave'
    });

    cellRendition.append('rect').attr({
      x: size/2,
      y: size/4,
      width: size * 0.7,
      height: size * 0.7,
      fill: '#444'
    });
  }

  function renderVolcanoToTile(cell, tile, cellRendition, size) {
    tile.attr({
      class: 'volcano'
    });
    cellRendition.append('path')
      .attr('d', d3.svg.symbol().type('triangle-up'))
      .attr('fill', 'red');
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
      y: size/2,
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
