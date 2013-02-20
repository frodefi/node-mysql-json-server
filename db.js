// Database related
'use strict';

var mysql   = require('mysql')
  , connection = mysql.createConnection({
      host     : process.env.mysql_host,
      user     : process.env.mysql_user,
      password : process.env.mysql_password,
      database : process.env.mysql_database
    });

connection.connect(function(err) {
  // connected! (unless `err` is set)
  if (err) {
    console.log("DB conn error...");
  } else {
    console.log("DB connected :)");
  }
});

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);

// The following database tables are used:
// CREATE TABLE Translations (
//    Id int UNSIGNED NOT NULL AUTO_INCREMENT,
//    Dictionary mediumint UNSIGNED,
//    UserId mediumint UNSIGNED, // When a user creates his own or modifies a default translation
//    OriginalTranslationId int UNSIGNED, // then these 2 columns are used
//    FromWord tinytext,
//    FromDescription text,
//    ToWord tinytext,
//    ToDescription text,
//    PRIMARY KEY(Id)
// )
//
// CREATE TABLE Users ()


exports.getTranslations = function getTanslations(data) {
  var query = connection.query('SELECT * FROM Translations WHERE Dictionary = ? AND (UserId = 0 OR UserId = ?) AND Id >= ? LIMIT ?;', data, function(err, result) {
    console.log("Ærrår:"+err+"Hir ar te resølts:");
    return fn(null, result[0]);
  });
  console.log(query.sql);
}

exports.createTranslation = function createTranslation(data) {
  var query = connection.query('INSERT INTO Translations SET ?', data, function(err, result) {
  });
  console.log(query.sql);
}

exports.updateTranslation = function createTranslation(data) {
}

exports.deleteTranslation = function createTranslation(id) {
}

exports.createUser = function createUser(username, password, email) {
  var query = connection.query('INSERT INTO Users (username, password, email) VALUES (?,SHA1(?),?)', [username, password, email], function(err, result) {
  });
  console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
}

exports.findUser = function findUser(username, password, fn) {
  var query = connection.query('SELECT id, username, password FROM Users WHERE username = ? AND password = SHA1(?);', [username, password], function(err, result) {
    console.log("Ærrår:"+err+"Hir ar te resølts:"+result[0].username);
    return fn(null, result[0]);
  });
  console.log(query.sql);
}
