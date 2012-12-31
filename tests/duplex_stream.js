var Stream = require('stream');

function write(b) {
  this.emit('write', b);
}

function end() {
  this.emit('end');
}

module.exports = function() {
  var s = new Stream();
  s.writable = true;
  s.readable = true;
  s.write = write;
  s.end = end;
  return s;
}