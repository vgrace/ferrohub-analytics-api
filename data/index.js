(function (data) {

    var seedData = require("./seedData");
    var database = require("./database");

    /*LOCAL DATABASE*/

    // LOADEVENTDETECTION

    data.delete_loadeventdetection_results = function (resultsid, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.loadeventdetection_results.deleteOne({ resultsid: resultsid }, next);
            }
        });
    }

    data.get_all_loadeventdetection_results = function (energyhubid, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.loadeventdetection_results.find({ energyhubid: energyhubid }, { data: 0 }).toArray(function (err, listResults) {
                    if (err) {
                        next(err, null);
                    }
                    else {
                        next(null, listResults); 
                    }
                });
            }
        });
    }

    data.get_loadeventdetection_results = function (resultsid, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                //db.loadeventdetection_results.findOneAndDelete({ resultsid: resultsid }, next);
                db.loadeventdetection_results.findOne({ resultsid: resultsid }, next);
            }
        });
    }

    data.add_loadeventdetection_jobs = function (job, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                // Check if there are pending jobs, jobstatus = 0
                db.loadeventdetection_jobs.find({ energyhubid: job.energyhubid, jobstatus: 0 }).count().then(function (pendingJobs) {
                    console.log(pendingJobs);
                    if (pendingJobs > 0) {
                        next('TOO MANY REQUESTS');
                    }
                    else {
                        db.loadeventdetection_jobs.insert(job, function (err) {
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
        });
    }

    // HOURLY
    data.hourly_listen = function (filter, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                console.log(filter);

                // set MongoDB cursor options
                var cursorOptions = {
                    tailable: true,
                    awaitdata: false,
                    maxTimeMS: 60000,
                    numberOfRetries: -1,
                    tailableRetryInterval: 10000
                };
                //var stream = db.poweranalysishour_jobs.find(filter, cursorOptions).addCursorFlag('tailable', true).addCursorFlag('awaitData', true).setCursorOption('numberOfRetries', -1).stream();
                var cursor = db.poweranalysishour_jobs_results.find(); 
                var stream = db.poweranalysishour_jobs_results.find(filter, cursorOptions).stream();
                stream.on('data', function (document) {
                    // Close the cursor, this is the same as reseting the query
                    cursor.close(function (err, result) {
                        //assert.equal(null, err);
                        if (err) {
                            next(err, null);
                        }
                        else {
                            //console.log(document);
                            next(null, document);
                        }
                        //db.close();
                    });
                    
                });
            }
        });
    }

    //data.hourly_listen = function (conditions, next) {
    //    database.getLocalDb(function (err, db) {
    //        if (err) {
    //            next(err);
    //        }
    //        else {
    //            coll = db.poweranalysishour_jobs_results
    //            latestCursor = coll.find(conditions).sort({ $natural: -1 }).limit(1)
    //            latestCursor.nextObject(function (err, latest) {
    //                if (latest) {
    //                    conditions._id = { $gt: latest._id }
    //                }
    //                options = {
    //                    tailable: true,
    //                    await_data: true,
    //                    numberOfRetries: -1
    //                }
    //                stream = coll.find(conditions, options).stream()
    //                stream.on('data', function (document) {
    //                    console.log(document); 
    //                    next(null, document);
    //                })
    //            })
    //        }
    //    });
    //}

    data.add_poweranalysishour_jobs = function (job, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysishour_jobs.find({ energyhubid: job.energyhubid, jobstatus: 0 }).count().then(function (pendingJobs) {
                    console.log(pendingJobs);
                    if (pendingJobs > 0) {
                        next('TOO MANY REQUESTS');
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

    data.test = function (next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.nullanalysis_jobs.findOne({ }, function (err, results) {
                    if (err) {
                        next(err, null);
                    }
                    else {
                        next(null, results);
                    }

                });
            }
        });
    }

    // NULLABLE
    data.nullable_listen = function (filter, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                console.log(filter);

                // set MongoDB cursor options
                var cursorOptions = {
                    tailable: true,
                    awaitdata: false,
                    maxTimeMS: 5000,
                    numberOfRetries: 10,
                    tailableRetryInterval: 10000
                };

                //var stream = db.poweranalysishour_jobs.find(filter, cursorOptions).addCursorFlag('tailable', true).addCursorFlag('awaitData', true).setCursorOption('numberOfRetries', -1).stream();
                var stream = db.nullanalysis_jobs_results.find(filter, cursorOptions).stream();
                stream.on('data', function (document) {
                    //console.log(document);
                    next(null, document);
                });
            }
        });
    }
    data.nullable_listen_test = function (conditions, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                var coll = db.nullanalysis_jobs_results
                var latestCursor = coll.find(conditions).sort({ $natural: -1 }).limit(1)
                latestCursor.nextObject(function (err, latest) {
                    if (latest) {
                        conditions._id = { $gt: latest._id }
                    }
                    options = {
                        tailable: true,
                        await_data: true,
                        maxTimeMS: 5000,
                        numberOfRetries: 10,
                    }
                    var stream = coll.find(conditions, options).stream(); 
                    stream.on('data', function (document) {
                        console.log("Found new results job!"); 
                        console.log(document);
                        latestCursor.close(function (err, result) {
                            if (err) {
                                next(err, null);
                            }
                            else {
                                next(null, document);
                            }
                            db.close();
                        });
                        
                    })
                })
            }
        });
    }
    data.add_nullanalysis_jobs = function (job, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.nullanalysis_jobs.insert(job, function (err) {
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

    data.get_nullanalysis_results = function (resultsid, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                //db.nullanalysis_results.findOneAndDelete({ resultsid: resultsid }, next);
                db.nullanalysis_results.findOneAndDelete({ resultsid: resultsid }, function (err, results) {
                    if (err) {
                        next(err, null); 
                    }
                    else {
                        next(null, results);
                    }
                    
                });
            }
        });
    }

    //DAILY
    data.daily_listen = function (filter, next) {
        console.log('daily listen...'); 
        database.getLocalDb(function (err, db) {
            console.log('get local db...');
            if (err) {
                next(err);
            }
            else {
                console.log(filter);
                console.log('db no error...');
                // set MongoDB cursor options
                var cursorOptions = {
                    tailable: true,
                    awaitdata: false,
                    maxTimeMS: 60000,
                    numberOfRetries: -1,
                    tailableRetryInterval: 10000
                };
                //var stream = db.poweranalysishour_jobs.find(filter, cursorOptions).addCursorFlag('tailable', true).addCursorFlag('awaitData', true).setCursorOption('numberOfRetries', -1).stream();
                var stream = db.poweranalysisday_jobs_results.find(filter, cursorOptions).stream();
                console.log('after stream...');
                stream.on('data', function (document) {
                    console.log("In stream on");
                    next(null, document);
                });
            }
        });
    }

    //data.daily_listen = function (conditions, next) {
    //    database.getLocalDb(function (err, db) {
    //        if (err) {
    //            next(err);
    //        }
    //        else {
    //            coll = db.poweranalysisday_jobs_results
    //            latestCursor = coll.find(conditions).sort({ $natural: -1 }).limit(1)
    //            latestCursor.nextObject(function (err, latest) {
    //                if (latest) {
    //                    conditions._id = { $gt: latest._id }
    //                }
    //                options = {
    //                    tailable: true,
    //                    await_data: true,
    //                    numberOfRetries: -1
    //                }
    //                stream = coll.find(conditions, options).stream()
    //                stream.on('data', function (document) {
    //                    console.log(document); 
    //                    next(null, document);
    //                })
    //            })
    //        }
    //    });
    //}

    data.add_poweranalysisday_jobs = function (job, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.poweranalysisday_jobs.find({ energyhubid: job.energyhubid, jobstatus: 0 }).count().then(function (pendingJobs) {
                    console.log(pendingJobs);
                    if (pendingJobs > 0) {
                        next('TOO MANY REQUESTS');
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

    /*DATABASE MLAB TEST DB*/

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

    data.addLoadEventResults = function (analysisResultsToInsert, next) {
        database.getLocalDb(function (err, db) {
            if (err) {
                next(err);
            }
            else {
                db.loadeventdetection_results.insert(analysisResultsToInsert, function (err) {
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