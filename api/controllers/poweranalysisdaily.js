(function (poweranalysisdaily) {

    var crypto = require('crypto');
    var data = require('../../data');
    var seedData = require('../../data/seedData');

    // POST /dailypower: operationId: get_daily_average_power
    poweranalysisdaily.make_poweranalysisdaily = function (req, res, next) {
        // Generated resultsId
        var resultsid = crypto.randomBytes(20).toString('hex');

        // Input parameters
        var energyhubid = "",
            starttime = "",
            endtime = "",
            userid = "",
            isTest = false,
            nullanalysis = false;
        if (req.swagger && req.swagger.body) {
            energyhubid = req.swagger.body.energyhubid;
            starttime = req.swagger.body.starttime;
            endtime = req.swagger.body.endtime;
            userid = req.swagger.body.userid;
            isTest = req.swagger.params.test.value;
        }
        else {
            energyhubid = req.body.energyhubid;
            starttime = req.body.starttime;
            endtime = req.body.endtime;
            userid = req.body.userid;
            isTest = typeof req.query.test === 'undefined' ? false : req.query.test !== "false";
            nullanalysis = typeof req.query.nullanalysis === 'undefined' ? false : req.query.nullanalysis !== "false";
        }

        

        //Express validator
        req.assert('energyhubid', 'Invalid parameter: this parameter cannot be empty').notEmpty();
        req.assert('starttime', 'Invalid parameter: this parameter cannot be empty').notEmpty();
        req.assert('endtime', 'Invalid parameter: this parameter cannot be empty').notEmpty();
        req.assert('userid', 'Invalid parameter: this parameter cannot be empty').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            var errors_str = "";
            for (var i = 0; i < errors.length; i++) {
                console.log(errors[i]);
                errors_str += "# Parameter: " + errors[i].param + ", Message: " + errors[i].msg + ", Value: " + errors[i].value + "  ";
            }
            var cust_error = {
                "code": 0,
                "message": "Validation errors",
                "fields": errors_str
            };
            res.status(400).send(cust_error);
            return;
        }
        // NULLABLE BASELINE TEST
        if (nullanalysis) {
            console.log("NULLABLE ON");
            // Create job
            var job = {
                "energyhubid": energyhubid,
                "starttime": new Date(starttime),
                "endtime": new Date(endtime),
                "userid": userid,
                "resultsid": resultsid,
                "analysismodel": "DAILYPOWER",
                "jobstatus": 0,
                "timestamp": new Date()
            };

            // Save job to local db
            data.add_nullanalysis_jobs(job, function (err) {
                if (err) {
                    console.log(err);
                    var err_msg = {
                        "code": 0,
                        "message": err,
                        "fields": ""
                    };
                    res.status(500).send(err_msg);
                }
                else {
                    console.log('Saved to local db');
                }
            });


            data.nullable_listen_test({ "resultsid": resultsid, "jobstatus": 1 }, function (err, job_results) {
                console.log("Listening...");

                if (err) {
                    console.log(err);
                    var err_msg = {
                        "code": 0,
                        "message": err,
                        "fields": ""
                    };

                    res.status(500).send(err_msg);
                }
                else {
                    console.log("The log stating there are results to retrieve");
                    console.log(job_results);

                    var results_found = {
                        "energyhubid": "Yay!",
                        "starttime": "2016-10-21T09:18:29.977Z",
                        "endtime": "2016-10-21T09:18:29.977Z",
                        "userid": "string",
                        "resultsid": "string",
                        "analysismodel": "DAILYPOWER",
                        "processingstatus": "PENDING",
                        "resultslink": "string"
                    };

                    //res.status(201).send(results_found);

                    data.get_nullanalysis_results(resultsid, function (err, final_results) {
                        if (err) {
                            console.log(err);
                            var err_msg = {
                                "code": 0,
                                "message": err,
                                "fields": ""
                            };
                            res.status(500).send(err_msg);
                        }
                        else {
                            console.log("Returning the results yao!");
                            var del = delete final_results.value._id;
                            var del_resultsid = delete final_results.value.resultsid;
                            var del_jobstatus = delete final_results.value.jobstatus;
                            var del_model = delete final_results.value.analysismodel;
                            final_results.value["returntimestamp"] = new Date()
                            res.send(final_results.value);
                        }
                    });
                }
            });
        }
        // TEST
        else if (isTest) {
            var analysis_job = {
                "energyhubid": energyhubid,
                "starttime": new Date(starttime),
                "endtime": new Date(endtime),
                "userid": userid,
                "resultsid": resultsid,
                "analysismodel": "DAILYPOWER",
                "processingstatus": "PENDING",
                "resultslink": "/poweranalysisday/" + resultsid
            };

            var analysis_results = {
                "energyhubid": energyhubid,
                "starttime": new Date(starttime),
                "endtime": new Date(endtime),
                "userid": userid,
                //"resultsid": resultsid,
                "data": seedData.getKwhData(seedData.ResultsDataArr, "DAY") //seedData.ResultsDataArr
            };
            data.test(function (err, results) {
                if (err) {
                    console.log(err);
                    var err_msg = {
                        "code": 0,
                        "message": err,
                        "fields": ""
                    };
                    res.status(500).send(err_msg);
                }
                else {
                    console.log(results); 
                    res.status(200).send(analysis_results);
                }
            })
            //res.status(200).send(analysis_results);
        }
        // REAL (TEST = false)
        else {
            // Create job
            var job = {
                "energyhubid": energyhubid,
                "starttime": new Date(starttime),
                "endtime": new Date(endtime),
                "userid": userid,
                "resultsid": resultsid,
                "analysismodel": "DAILYPOWER",
                "jobstatus": 0,
                "timestamp": new Date()
            };

            // Save job to local db
            data.add_poweranalysisday_jobs(job, function (err) {
                if (err) {
                    console.log(err);
                    var err_msg = {
                        "code": 0,
                        "message": err,
                        "fields": ""
                    };
                    res.status(500).send(err_msg);
                }
                else {
                    console.log('Saved to local db');
                }
            });

            data.daily_listen({ "resultsid": resultsid, "jobstatus": 1 }, function (err, job_results) {
                console.log("Listening...");

                if (err) {
                    console.log(err);
                    var err_msg = {
                        "code": 0,
                        "message": err,
                        "fields": ""
                    };

                    res.status(500).send(err_msg);
                }
                else {
                    console.log("The log stating there are results to retrieve");
                    console.log(job_results);

                    var results_found = {
                        "energyhubid": "Yay!",
                        "starttime": "2016-10-21T09:18:29.977Z",
                        "endtime": "2016-10-21T09:18:29.977Z",
                        "userid": "string",
                        "resultsid": "string",
                        "analysismodel": "DAILYPOWER",
                        "processingstatus": "PENDING",
                        "resultslink": "string"
                    };

                    //res.status(201).send(results_found);

                    data.get_poweranalysisday_results(resultsid, function (err, final_results) {
                        if (err) {
                            console.log(err);
                            var err_msg = {
                                "code": 0,
                                "message": err,
                                "fields": ""
                            };
                            res.status(500).send(err_msg);
                        }
                        else {
                            console.log("Returning the results yao!");
                            var del = delete final_results.value._id;
                            var del_resultsid = delete final_results.value.resultsid;
                            var del_jobstatus = delete final_results.value.jobstatus;
                            var del_model = delete final_results.value.analysismodel;
                            res.send(final_results.value);
                        }
                    });
                }
            });
        }
    }

    function getResults(resultsId, next) {
        //data.getPowerAnalysisResults(resultsId, function (err, results) {
        data.get_poweranalysisday_results(resultsId, function (err, results) {
            if (err) {
                console.log("Error in getResults");
                console.log(err);
                next(err, null);
            }
            else {
                console.log("No error");
                console.log(results);
                next(null, results);
            }
        });
    }

    // GET /dailypower/{resultsid}: operationId: get_poweranalysisdaily_result
    poweranalysisdaily.get_poweranalysisdaily_result = function (req, res, next) {
        // String querys
        var id = req.swagger.params.resultsid.value;
        var isTest = req.swagger.params.test.value === "" ? true : req.swagger.params.test.value;

        // TEST
        if (isTest) {
            var any_response = {
                "energyhubid": "8674654",
                "starttime": "2016-10-07T07:49:32.762Z",
                "endtime": "2016-10-07T07:49:32.762Z",
                "userid": "6545",
                //"resultsid": id,
                "data": seedData.getKwhData(seedData.ResultsDataArr, "DAY") //seedData.ResultsDataArr
            };
            res.status(200).send(any_response);
        }
            // REAL (TEST = false)
        else {
            data.get_poweranalysisday_results(id, function (err, analysisResults) {
                var resultsData = analysisResults.value;
                if (err) {
                    //Server error -> 500
                    var err_msg = {
                        "code": 0,
                        "message": "Internal Server Error: " + err,
                        "fields": ""
                    };
                    res.status(500).send(err_msg);
                }
                else {
                    if (resultsData == null) {
                        // Results not found -> 404
                        var not_found = {
                            "resultsid": id,
                            "analysismodel": "DAILYPOWER",
                            "processingstatus": "PENDING",
                            "resultslink": "Resultsid:" + id + " not found"
                        };
                        res.status(404).send(not_found);
                    }
                    else {
                        res.set("Content-Type", "application/json");
                        //Object found with results -> 200
                        if (resultsData.data.length > 0) {
                            var del = delete resultsData._id;
                            var del_resultsid = delete resultsData.resultsid;
                            var del_jobstatus = delete resultsData.jobstatus;
                            var del_model = delete resultsData.analysismodel;
                            console.log(del);
                            res.send(resultsData);
                        }
                        else {
                            //No results yet -> 404
                            var no_res_err = {
                                "resultsid": id,
                                "analysismodel": "DAILYPOWER",
                                "processingstatus": "PENDING",
                                "resultslink": "/dailypower/" + resultsData.resultsid
                            };
                            res.status(404).send(no_res_err);
                        }
                    }
                }
            });
        }
    }

})(module.exports);