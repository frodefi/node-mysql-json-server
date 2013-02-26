'use strict';

var restify = require('restify')
  , db      = require('./db');
var server = restify.createServer({
  name: 'json-server'
});
server.use(restify.bodyParser());

server.get('/vocababe/get', getTranslationsById); // /:id/:rows
server.post('/vocababe/create', createTranslation); // curl --data "userId=1&dictionary=1&originalTranslationId=0&fromWord=Fisk&fromDescription=&toWord=Zivis&toDescription=" localhost:8080/vocababe/create
server.put('/vocababe/update', updateTranslation);
server.del('/vocababe/delete', deleteTranslation);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function getTranslationsById(req, res) {
  var fields = [
    req.params.id,
    req.params.userId,
    req.params.dictionary,
    req.params.rows
  ];
  db.getTranslationsById(fields, function (err, rows) {
    return err ? res.send(err) : res.send(JSON.strinigfy({rows: rows}));
  });
}

function getTranslationsByWord(req, res) {
  db.getTranslationsByWord([
    req.params.userId,
    req.params.dictionary,
    req.params.word,
    req.params.includeDescription
  ]);
}

function test(req, res) {
  res.send("hey " + JSON.stringify(req.params));
}

function createTranslation(req, res) {
  var fields = [
    req.params.userId,
    req.params.dictionary,
    req.params.originalTranslationId,
    req.params.fromWord,
    req.params.fromDescription,
    req.params.toWord,
    req.params.toDescription
  ];
  db.createTranslation(fields, function (err, result) {
    if (err) {
      return res.json({"error":"something went wrong" + err});
    }
    res.send(JSON.stringify({id: result.insertId}));
  });
}

function updateTranslation(req, res, next) {
  updateTranslations(req.params);
}

function deleteTranslation(req, res, next) {
  deleteTranslations(req.params.id);
}
