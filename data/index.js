(function (data) {

    var seedData = require("./seedData");
    var database = require("./database");

    /*LOCAL DATABASE*/

    // HOURLY
    data.add_poweranalysishour_jobs = function (job, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysishour_jobs.insert(job, function (err) {
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

    data.get_poweranalysishour_results = function (resultsid, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysishour_results.findOneAndDelete({ resultsid: resultsid }, next);
            }
        });
    }

    //DAILY
    data.add_poweranalysisday_jobs = function (job, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysisday_jobs.insert(job, function (err) {
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

    data.get_poweranalysisday_results = function (resultsid, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysisday_results.findOneAndDelete({ resultsid: resultsid }, next);
            }
        });
    }

    /*DATABASE*/

    //Post poweranalysisjob
    data.addPowerAnalysisTrendJob = function (jobToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysistrendjobs.insert(jobToInsert, function (err) {
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

    //Add poweranalysistrendresults
    data.addPowerAnalysisTrendResults = function (analysisResultsToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysistrends.insert(analysisResultsToInsert, function (err) {
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

    //Get poweranalysistrendresults
    data.getPowerAnalysisTrendResults = function (restultsId, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysistrends.findOneAndDelete({ resultsid: restultsId }, next);
            }
        });

    };

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