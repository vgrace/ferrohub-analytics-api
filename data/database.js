//database js
(function (database) {
    var mysql = require("mysql");
    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://ferrohub:ferrohub2016@ds029705.mlab.com:29705/ferrohub";//Test db

    var theDb = null;
    var mysqlConnection = null;

    //Local Database
    var mongoLocalUrl = "mongodb://localhost:27017/analytics";
    var theLocalDb = null;

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

    database.getLocalDb = function (next) {
        if (!theLocalDb) {
            //connect to db
            mongodb.MongoClient.connect(mongoLocalUrl, function (err, db) {
                if (err) {
                    next(err, null);
                }
                else {
                    theLocalDb = {
                        db: db,
                        poweranalysisday_jobs: db.collection("poweranalysisday_jobs"),
                        poweranalysisday_results: db.collection("poweranalysisday_results"),
                        poweranalysisday_jobs_results: db.collection("poweranalysisday_jobs_results"),
                        poweranalysishour_jobs: db.collection("poweranalysishour_jobs"),
                        poweranalysishour_results: db.collection("poweranalysishour_results"),
                        poweranalysishour_jobs_results: db.collection("poweranalysishour_jobs_results"),
                        nullanalysis_jobs: db.collection("nullanalysis_jobs"),
                        nullanalysis_results: db.collection("nullanalysis_results"),
                        nullanalysis_jobs_results: db.collection("nullanalysis_jobs_results"),
                        loadeventdetection_jobs: db.collection("load_event_detection_jobs"), // New
                        loadeventdetection_results: db.collection("load_event_detection_results"), // New

                    };
                    next(null, theLocalDb);
                }
            });
        }
        else {
            next(null, theLocalDb);
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