(function (data) {

    var seedData = require("./seedData");
    var database = require("./database");

    //Post poweranalysisjob
    data.addPowerAnalysisJob = function (jobToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysisdayjobs.insert(jobToInsert, function (err) {
                    if (err) {
                        next(err);
                    }
                    else {
                        next(null); 
                    }
                });
            }
        });
    }

    //Add poweranalysisresults
    data.addPowerAnalysisResults = function (analysisResultsToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysisdays.insert(analysisResultsToInsert, function (err) {
                    if (err) {
                        next(err);
                    }
                    else {
                        next(null); 
                    }
                })
            }
        });
    }

    //Get poweranalysisresults
    data.getPowerAnalysisResults = function (restultsId, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysisdays.findOneAndDelete({ resultsid: restultsId }, next);
            }
        });

    };
    
    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log('Failed to seed db');
            }
            else {
                //test to see if data exists
                db.poweranalysisdays.count(function (err, count) {
                    if (err) {
                        console.log("Failed to retriece database count");
                    }
                    else {
                        if (count == 0) {
                            console.log("Seeding the analysis...")
                            db.poweranalysisdays.insert(seedData.results, function (err) {
                                if (err) {
                                    console.log("Failed to add analysis to database");
                                }
                            });
                        }
                        else {
                            console.log("Analysis already seeded");
                        }
                    }
                });
                db.poweranalysisdayjobs.count(function (err, count) {
                    if (err) {
                        console.log("Failed to retriece database count");
                    }
                    else {
                        if (count == 0) {
                            console.log("Seeding the jobs...")
                            db.poweranalysisdayjobs.insert(seedData.job, function (err) {
                                if (err) {
                                    console.log("Failed to add job to database");
                                }
                            });
                        }
                        else {
                            console.log("Jobs already seeded");
                        }
                    }
                });
            }

        });
    }

    function testMysql() {
        database.getMysql(function (err, tblRows) {
            if (err) {
                console.log('Failed to connect to mysql');
                console.log(err); 
            }
            else {
                console.log('SUCCESS!'); 
                console.log(tblRows);
            }
        });
    }

    //testMysql(); 
    //seedDatabase(); 
})(module.exports);