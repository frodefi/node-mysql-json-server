'use strict';

var restify = require('restify')
  , db      = require('./db');

var server = restify.createServer({
  name: 'json-server'
});

server.get('/vocababe/get/:id/:rows', getTranslations;
server.post('/vocababe/new', createTranslation);
server.put('/vocababe/edit', updateTranslation);
server.del('/vocababe/delete', deleteTranslation);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function getTranslationsById(req, res) {
  res.send(db.getTranslations({
    Dictionary: req.params.dictionary,
    UserId: req.params.userId, // When a user creates his own or modifies a default translation
    OriginalTranslationId: req.params.originalTranslationId, // then these 2 liene
  }));
}

function getTranslationsByWord(req, res) {
  res.send(db.getTranslations({
    Dictionary: req.params.dictionary,
    UserId: req.params.userId, // When a user creates his own or modifies a default translation
    OriginalTranslationId: req.params.originalTranslationId, // then these 2 columns are u
    FromWord: req.params.fromWord,
    FromDescription: req.params.FromDescription,
    ToWord: req.params.toWord,
    ToDescription: req.params.toDescription
  }));
}

function createTranslation(req, res) {
  res.send(db.getTranslations({
    Dictionary: req.params.dictionary,
    UserId: req.params.userId, // When a user creates his own or modifies a default translation
    OriginalTranslationId: req.params.originalTranslationId, // then these 2 columns are used
    FromWord: req.params.fromWord,
    FromDescription: req.params.FromDescription,
    ToWord: req.params.toWord,
    ToDescription: req.params.toDescription
  }));
}

function updateTranslation(req, res, next) {
  var result = updateTranslations(req.body);
  res.send(result);
}

function deleteTranslation(req, res, next) {
  var result = deleteTranslations(req.params.id);
  res.send(result);
}
