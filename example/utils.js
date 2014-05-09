var utils = (function utilsScope() {

function makeRequest(opts) {
  opts = defaults(opts, {mimeType: 'application/json'});

  var xhr = new XMLHttpRequest();
  xhr.open(opts.method,  opts.url);
  if (opts.method === 'POST') {
    xhr.setRequestHeader('content-type', opts.mimeType);
  }
  else if (opts.method === 'GET') {
    xhr.setRequestHeader('accept', opts.mimeType);
  }

  var timeoutKey = null;

  xhr.onload = function requestDone() {
    clearTimeout(timeoutKey);
    
    if (this.status === 200) {

      var resultObject = this.responseText;
      if (opts.mimeType === 'application/json') {
        resultObject = JSON.parse(resultObject);
      }
      opts.done(null, resultObject);
    }
    else {
      opts.done('Error while making request. XHR status: ' + this.status, null);
    }
  };

  if (opts.onData) {
    var lastReadIndex = 0;
    xhr.onprogress = function progressReceived() {
      opts.onData(this.responseText.substr(lastReadIndex));
      lastReadIndex = this.responseText.length;
    };   
  }
 
  xhr.send(opts.method === 'POST' ? opts.body : undefined);

  if (opts.timeLimit > 0) {
    timeoutKey = setTimeout(cancelRequest, opts.timeLimit);
  }

  function cancelRequest() {
    xhr.abort();
    clearTimeout(timeoutKey);
    opts.done('Timed out', null);
  }

  return {
    url: opts.url,
    cancelRequest: cancelRequest
  };
}

// From Underscore, more or less.
function defaults(obj, source) {
  if (source) {
    for (var prop in source) {
      if (obj[prop] === undefined) {
        obj[prop] = source[prop];
      }
    }
  }

  return obj;
}

function space(func, wait) {
  var queuedFunctionsAndContexts = [];
  var timeoutChainRunning = false;

  function queueFn() {
    // Capture 'this' and args for when the function runs later.
    queuedFunctionsAndContexts.unshift({
      fn: func, 
      context: this,
      args: arguments
    });

    if (!timeoutChainRunning) {
      timeoutChainRunning = true;
      runNextFn();      
    }

    function runNextFn() {
      // Get the next function to go.
      var next = queuedFunctionsAndContexts.pop();
      // Run it if it exists.
      if (next && next.fn) {
        next.fn.apply(next.context, next.args);
        // Schedule the next run.
        setTimeout(runNextFn, wait);
      }
      else {
        timeoutChainRunning = false;
      }
    }
  }

  return queueFn;
}

// http://fitzgeraldnick.com/weblog/35/
function yieldingEach(items, iterFn, callback) {
  var i = 0, len = items.length;
  async(function () {
    var result;

    // Process the items in batch for 50 ms or while the result of
    // calling `iterFn` on the current item is not false.
    for (var start = +new Date;
      i < len && result !== false && ((+new Date) - start < 50);
      i++ ) {

      result = iterFn.call(items[i], items[i], i);
    }

    // When the 50ms is up, let the UI thread update by defering the
    // rest of the iteration with `async`.
    if (i < len && result !== false ) {
        async(arguments.callee);
    } 
    else {
        callback(items);
    }
  });
}

function async (fn) {
  setTimeout(fn, 20);
}


return {
  makeRequest: makeRequest,
  defaults: defaults,
  space: space,
  yieldingEach: yieldingEach
};

}());
