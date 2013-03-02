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

// Testing with a table representing a simple dictionary:
// CREATE TABLE Translations (
//    Id int UNSIGNED NOT NULL AUTO_INCREMENT,
//    Dictionary mediumint UNSIGNED,
//    UserId mediumint UNSIGNED, // When a user creates his own or modifies a default translation
//    OriginalTranslationId int UNSIGNED, // then these 2 columns are used
//    FromWord tinytext,
//    FromDescription text,
//    ToWord tinytext,
//    ToDescription text,
//    LastChanged timestamp,
//    PRIMARY KEY(Id)
// )
//

exports.getTranslationsByDictionary = function (data, callback) {
  var queryData = [
    { UserId              : data[0] },
    { Dictionary          : data[1] }
  ];
  var query = connection.query('SELECT * FROM Translations WHERE (UserId = 0 OR ?) AND ?;', queryData, callback);
  console.log(query.sql);
};

exports.getTranslationsByDate = function (data, callback) {
  var queryData = [
    { UserId              : data[0] },
    { Dictionary          : data[1] },
    data[2] // LastChanged
  ];
  var query = connection.query('SELECT * FROM Translations WHERE (UserId = 0 OR ?) AND ? AND LastChanged > ?;', queryData, callback);
  console.log(query.sql);
};

exports.createTranslation = function (data, callback) {
  var queryData = {
    Dictionary            : data[0],
    UserId                : data[1],
    FromWord              : data[2],
    FromDescription       : data[3],
    ToWord                : data[4],
    ToDescription         : data[5],
    OriginalTranslationId : data[6]
  }
  connection.query('INSERT INTO Translations SET ?', queryData, callback);
};

exports.updateTranslation = function (data, callback) {
  var queryData = [
    {
      FromWord            : data[0],
      FromDescription     : data[1],
      ToWord              : data[2],
      ToDescription       : data[3]
    },
    { UserId              : data[4] },
    { Id                  : data[5] }
  ];
  var query = connection.query('UPDATE Translations SET ? WHERE ? AND ?', queryData, callback);
  console.log(query.sql);
};

exports.deleteTranslation = function (data, callback) {
  var queryData = [
    { UserId              : data[0] },
    { Id                  : data[1] }
  ];
  var query = connection.query('DELETE FROM Translations WHERE ? AND ?;', queryData, callback);
  console.log(query.sql);
};
