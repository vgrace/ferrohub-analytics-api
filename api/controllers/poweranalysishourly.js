(function (poweranalysishourly) {
    var crypto = require('crypto');
    var data = require('../../data');
    var seedData = require('../../data/seedData');

    // POST /hourlypower: operationId: make_poweranalysishourly
    poweranalysishourly.make_poweranalysishourly = function (req, res, next) {
        try {
            // Generated resultsId
            var resultsid = crypto.randomBytes(20).toString('hex');

            // Input parameters
            var energyhubid = "",
                starttime = "",
                endtime = "",
                userid = "",
                isTest = false;

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

            // TEST
            if (isTest) {
                var analysis_job = {
                    "energyhubid": energyhubid,
                    "starttime": new Date(starttime),
                    "endtime": new Date(endtime),
                    "userid": userid,
                    "resultsid": resultsid,
                    "analysismodel": "HOURLYPOWER",
                    "processingstatus": "PENDING",
                    "resultslink": "/hourlypower/" + resultsid
                };

                var analysis_results = {
                    "energyhubid": energyhubid,
                    "starttime": new Date(starttime),
                    "endtime": new Date(endtime),
                    "userid": userid,
                    //"resultsid": resultsid,
                    "data": seedData.ResultsHourly
                };
                res.status(200).send(seedData.ResultsHourly);
            } else {
                // REAL (TEST = false)
                var stopRun = false;
                // Create job
                var job = {
                    "energyhubid": energyhubid,
                    "starttime": new Date(starttime),
                    "endtime": new Date(endtime),
                    "userid": userid,
                    "resultsid": resultsid,
                    "analysismodel": "HOURLYPOWER",
                    "jobstatus": 0,
                };
                // Save job 
                data.p_add_poweranalysishour_jobs(job).then(jobres => {
                    // Check results
                    getResults(resultsid, polling);
                    // Timeout set to 2 sec
                    var timeOut = setTimeout(function () {
                        console.log('Timer stop');
                        stopRun = true;
                        var err_msg = {
                            "code": 0,
                            "message": 'Timeout',
                            "fields": ""
                        };
                        res.status(500).send(err_msg);
                    }, 5000);

                    // Poll until there is results or timeout
                    function polling(err, results) {
                        if (stopRun === false) {
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
                                if (results.value === null) {
                                    //No data yet call again
                                    getResults(resultsid, polling);
                                }
                                else if (results.value !== null) {
                                    //Found data
                                    var del = delete results.value._id;
                                    var del_resultsid = delete results.value.resultsid;
                                    var del_jobstatus = delete results.value.jobstatus;
                                    var del_model = delete results.value.analysismodel;
                                    clearTimeout(timeOut);
                                    res.send(results.value);
                                }
                            }
                        }
                    }
                    // Get results
                    function getResults(resultsId, next) {
                        data.p_get_poweranalysishour_results(resultsid).then(results=> {
                            next(null, results);
                        }).catch(err => {
                            var cust_error = {
                                "code": 0,
                                "message": "Errors",
                                "fields": err
                            };
                            res.status(400).send(cust_error);
                        });
                    }
                }).catch(err => {
                    var cust_error = {
                        "code": 0,
                        "message": "Errors",
                        "fields": err
                    };
                    res.status(400).send(cust_error);
                });
            }
        }
        catch (e) {
            var err_msg = {
                "code": 0,
                "message": e.message,
                "fields": ""
            };
            console.log(err_msg);
            res.status(500).send(err_msg);
        }
    }

    // GET /hourlypower/{resultsid}: operationId: get_poweranalysishourly_result
    poweranalysishourly.get_poweranalysishourly_result = function (req, res, next) {
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
                "data": seedData.ResultsHourly
            };
            res.status(200).send(seedData.ResultsHourly);
        }
            // REAL (TEST = false)
        else {
            // OBS! Change to local db function
            //data.get_poweranalysishour_results(id, function (err, analysisResults) {
            //    var resultsData = analysisResults.value;
            //    if (err) {
            //        //Server error -> 500
            //        var err_msg = {
            //            "code": 0,
            //            "message": "Internal Server Error: " + err,
            //            "fields": ""
            //        };
            //        res.status(500).send(err_msg);
            //    }
            //    else {
            //        if (resultsData == null) {
            //            // Results not found -> 404
            //            var not_found = {
            //                "resultsid": id,
            //                "analysismodel": "HOURLYPOWER",
            //                "processingstatus": "PENDING",
            //                "resultslink": "Resultsid:" + id + " not found"
            //            };
            //            res.status(404).send(not_found);
            //        }
            //        else {
            //            res.set("Content-Type", "application/json");
            //            //Object found with results -> 200
            //            if (resultsData.data.length > 0) {
            //                var del = delete resultsData._id;
            //                var del_resultsid = delete resultsData.resultsid;
            //                var del_jobstatus = delete resultsData.jobstatus;
            //                var del_model = delete resultsData.analysismodel;
            //                console.log(del);
            //                res.send(resultsData);
            //            }
            //            else {
            //                //No results yet -> 404
            //                var no_res_err = {
            //                    "resultsid": id,
            //                    "analysismodel": "DAILYPOWER",
            //                    "processingstatus": "PENDING",
            //                    "resultslink": "/hourlypower/" + resultsData.resultsid
            //                };
            //                res.status(404).send(no_res_err);
            //            }
            //        }
            //    }
            //});
        }
    }

})(module.exports);