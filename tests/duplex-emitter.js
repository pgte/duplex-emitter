var test = require('tape');
var duplexStream = require('./utils/duplex_stream');
var duplexEmitter = require('../');
var fs = require('fs');
var Stream = require('stream');
var fixtures = require('./utils/fixtures');

test('serializes', function(t) {

  t.plan(1);

  var s = duplexStream();
  var e = duplexEmitter(s);

  var collected = [];
  s.on('write', collected.push.bind(collected));

  e.emit('abc', 'def', 'ghi');
  e.emit('def', 'ghi', 'jkl');
  e.emit('noargs');
  e.emit('justone', 1);

  t.equal(
    fixtures,
    collected.join(''));
});

test('emits', function(t) {

  t.plan(9);

  var s = duplexStream();
  var e = duplexEmitter(s);

  var chunks = fixtures.match(/.{1,2}/g);

  function schedule() {
    setTimeout(function() {
      var chunk = chunks.shift();
      if (chunk) {
        s.emit('data', chunk);
        schedule();
      }
    }, 0)
  }
  schedule();

  e.on('abc', function(a, b, c) {
    t.equal(a, 'def');
    t.equal(b, 'ghi');
    t.equal(c, undefined);
  });

  e.on('def', function(a, b, c) {
    t.equal(a, 'ghi');
    t.equal(b, 'jkl');
    t.equal(c, undefined);
  });

  e.on('noargs', function(a) {
    t.equal(a, undefined);
  });

  e.on('justone', function(a, b) {
    t.equal(a, 1);
    t.equal(b, undefined);
  });


});

test('once works', function(t) {
  t.plan(2);

  var s = new Stream();
  s.readable = true;
  s.setEncoding = function(e) {
    s._encoding = e;
  };
  var e = duplexEmitter(s);

  e.once('AAA', function(a, b) {
    t.equal(a, 'a');
    t.equal(b, 'b');
  });
  s.emit('data', '[\n["AAA", "a", "b"]\n,\n["AAA", "c", "d"]')
  s.emit('end');

});