function createAccessors(opts) {
  function accessorFunctor(property) {
    return function accessProperty(d) {
      return d[property];
    };
  }

  function arrayElementFunctor(index) {
    return function accessElement(d) {
      return d[index];
    };
  }

  function translateFunctor(xProp, yProp) {
    return function translate(d) {
      return 'translate(' + d[xProp] + ',' + d[yProp] + ')';
    };
  }

  var cache = {
    accessorFunctor: accessorFunctor,
    arrayElementFunctor: arrayElementFunctor,
    translateFunctor: translateFunctor,
    // translateToPosition: translateFunctor('x', 'y'),
  };


  if (opts.simpleAccessors) {
    opts.simpleAccessors.forEach(function setUpAccessor(property) {
      cache[property] = accessorFunctor(property);
    });
  }  

  return cache;
}

