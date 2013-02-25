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

function getTranslationsById(req, res) {
  res.send(db.getTranslations([
    req.params.id,
    req.params.userId,
    req.params.dictionary, 
    req.params.rows
  ]));
}

function getTranslationsByWord(req, res) {
  res.send(db.getTranslations([
    req.params.userId,
    req.params.dictionary,
    req.params.word,
    req.params.includeDescription
  ]));
}

function createTranslation(req, res) {
  res.send(db.getTranslations([
    req.params.userId,
    req.params.dictionary,
    req.params.originalTranslationId,
    req.params.fromWord,
    req.params.FromDescription,
    req.params.toWord,
    req.params.toDescription
  ]));
}

function updateTranslation(req, res, next) {
  var result = updateTranslations(req.body);
  res.send(result);
}

function deleteTranslation(req, res, next) {
  var result = deleteTranslations(req.params.id);
  res.send(result);
}
