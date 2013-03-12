'use strict';

var restify = require('restify')
  , db      = require('./db');

var server = restify.createServer({
  name: 'json-server'
});

server.use(restify.bodyParser());
server.use(restify.queryParser());

server.get('/get', getTranslations); // curl -i http://localhost:8080/get
server.post('/create', createTranslation); // curl -i -X POST -H 'Content-Type: application/json' -d  "userId=1&dictionary=1&originalTranslationId=0&fromWord=Fisk&fromDescription=&toWord=Zivis&toDescription=" localhost:8080/create
server.put('/update', updateTranslation); // curl -i -X PUT -H 'Content-Type: application/json' -d  "userId=1&dictionary=1&originalTranslationId=0&fromWord=Fisk&fromDescription=&toWord=Zivis&toDescription=" localhost:8080/update
server.del('/delete', deleteTranslation); // curl -i -X DELETE http://localhost:8080/delete/51374299e669481c48a25c8c

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function callback (err, result) {
  return err ? res.send(err) : res.json(result);
}

function getTranslations(req, res) {
  var fields = [
    req.params.userId, // The user login is not implemented, so just give it an id of your liking for now
    req.params.dictionary,
    req.params.lastChanged
  ];
  if (req.params.lastChanged) {
    db.getTranslationsByDate(fields, function (err, result) {   return err ? res.send(err) : res.json(result); });
  } else {
    db.getTranslationsByDictionary(fields, function (err, result) {   return err ? res.send(err) : res.json(result); });
  }
  console.log(fields);
}

function getTranslationsByDate(req, res) {
  var fields = [
    req.params.lastChanged,
    req.params.userId,
    req.params.dictionary
  ];
  console.log(fields);
  db.getTranslationsById(fields, function (err, result) {   return err ? res.send(err) : res.json(result); });
}

function test(req, res) {
  res.send("hey " + JSON.stringify(req.params));
}

function createTranslation(req, res) {
  var fields = [
    req.params.userId,
    req.params.dictionary,
    req.params.fromWord,
    req.params.fromDescription,
    req.params.toWord,
    req.params.toDescription,
    req.params.originalTranslationId
  ];
  db.createTranslation(fields, function (err, result) {
    if (err) {
      return res.json({"error":"something went wrong" + err});
    }
    res.json(result.insertId);
  });
}

function updateTranslation(req, res) {
  var fields = [
    req.params.fromWord,
    req.params.fromDescription,
    req.params.toWord,
    req.params.toDescription,
    req.params.userId,
    req.params.id
  ];
  console.log(fields);
  db.updateTranslation(fields, function (err, result) {   return err ? res.send(err) : res.json(result); });
}

function deleteTranslation(req, res) {
  var fields = [
    req.params.userId,
    req.params.id
  ];
  console.log(fields);
  db.deleteTranslation(fields, function (err, result) {   return err ? res.send(err) : res.json(result); });
}
