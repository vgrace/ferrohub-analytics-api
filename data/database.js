//database js
(function (database) {
    var mysql = require("mysql");
    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://ferrohub:ferrohub2016@ds029705.mlab.com:29705/ferrohub";
    var theDb = null;
    var mysqlConnection = null; 
    database.getDb = function (next) {
        if (!theDb) {
            //connect to db
            mongodb.MongoClient.connect(mongoUrl, function (err, db) {
                if (err) {
                    next(err, null);
                }
                else {
                    theDb = {
                        db: db,
                        poweranalysisdays: db.collection("test_poweranalysisdays"),
                        poweranalysisdayjobs: db.collection("test_poweranalysisdayjobs"),
                        poweranalysistrends: db.collection("test_poweranalysistrends"),
                        poweranalysistrendjobs: db.collection("test_poweranalysistrendjobs")
                    };
                    next(null, theDb); 
                }
            });
        }
        else {
            next(null, theDb); 
        }
    }

    database.getMysql = function (next) {
        mysqlConnection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cdcol'
        });
        mysqlConnection.query('SELECT * from cds', function (err, rows, fields) {
            if (err) {
                next(err, null);
            }
            else {
                next(null, rows);
            }
        });
        mysqlConnection.end(); 
    }
})(module.exports)