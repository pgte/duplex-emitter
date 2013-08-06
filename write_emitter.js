var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var slice = Array.prototype.slice;

module.exports =
function createWriteEmitter(stream) {
  return new WriteEmitter(stream);
};

function WriteEmitter(stream) {
  EventEmitter.call(this);

  this._stream = stream;
};

inherits(WriteEmitter, EventEmitter);

WriteEmitter.prototype.emit = function emit() {
  var message = JSON.stringify(slice.apply(arguments)) + '\n';
  if (this._stream.writable)
    this._stream.write(message);
};