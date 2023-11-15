import { Request } from 'tedious';

function executeSql(db, sql) {
  return new Promise((resolve, reject) => {
    var request = new Request(sql, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    var result = [];
    request.on('row', function (columns) {
      var row = {};
      columns.forEach(function (column) {
        row[column.metadata.colName] = column.value === null ? 'NULL' : column.value;
      });
      result.push(row);
    });

    db.execSql(request); // This starts the query execution
  });
}

export default executeSql;