var EventEmitter = require('events').EventEmitter;
var emitStream = require('emit-stream');

function emitter(stream) {
  // Read events from the client
  var readEmitter = emitStream.fromStream(stream);

  // Write events to the client
  var writeEmitter = new EventEmitter;
  var writeStream = emitStream.toStream(writeEmitter);
  writeStream.pipe(stream);

  return {
    on: readEmitter.on.bind(readEmitter),
    emit: writeEmitter.emit.bind(writeEmitter)
  };
}

module.exports = emitter;