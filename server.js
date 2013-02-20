'use strict';

var restify = require('restify')
  , db      = require('./db');

var server = restify.createServer({
  name: 'json-server'
});

server.get('/vocababe/get/:id/:rows', getTranslations);
server.post('/vocababe/new', createTranslation);
server.put('/vocababe/edit', updateTranslation);
server.del('/vocababe/delete', deleteTranslation);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function getTranslations(req, res) {
  var result = getTranslations(req.params.id,req.params.rows);
  res.send(result);
}

function createTranslation(req, res) {
  var result = createTranslations(req.body);
  res.send(result);
}

function updateTranslation(req, res, next) {
  var result = updateTranslations(req.body);
  res.send(result);
}

function deleteTranslation(req, res, next) {
  var result = deleteTranslations(req.params.id);
  res.send(result);
}
