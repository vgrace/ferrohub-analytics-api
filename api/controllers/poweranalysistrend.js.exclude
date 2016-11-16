(function (poweranalysistrend) {

    var crypto = require('crypto');
    var data = require('../../data');//Real db
    var seedData = require('../../data/seedData');

    //POST /poweranalysisday
    poweranalysistrend.make_dailytrend_analysis = function (req, res, next) {
        var body_object = getCorrectReq(req);
        if (body_object.isTest) {
            req.assert('energyhubid', 'Invalid parameter: this parameter cannot be empty').notEmpty();
            req.assert('starttime', 'Invalid parameter: this parameter cannot be empty').notEmpty();
            req.assert('starttime', 'Invalid parameter: valid date required E.g. 2016-05-17T15:28:34Z').isISO8601(body_object.starttime);
            req.assert('endtime', 'Invalid parameter: this parameter cannot be empty').notEmpty();
            req.assert('endtime', 'Invalid parameter: valid date required E.g. 2016-05-17T15:28:34Z').isISO8601(body_object.endtime);
            req.assert('userid', 'Invalid parameter: this parameter cannot be empty').notEmpty();
            //req.assert('daytype', 'Invalid parameter: this parameter cannot be empty').notEmpty();

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
                console.log(errors);
                res.status(400).send(cust_error);
                return;
            }
            else {
                // CREATED - A receipt for an analysis result, contains unique id and link to where the result will be available. -> 201
                var resultsid = crypto.randomBytes(20).toString('hex');

                var response_post = {
                    "energyhubid": body_object.energyhubid,
                    "starttime": body_object.starttime,
                    "endtime": body_object.endtime,
                    "userid": body_object.userid,
                    "resultsid": resultsid,
                    "analysismodel": "POWERANALYSISDAY",
                    "processingstatus": "PENDING",
                    "resultslink": "/poweranalysistrend/" + resultsid
                };
                
                // OK - Analysis result available. -> 200
                
                var analysis_results = {
                    "energyhubid": body_object.energyhubid,
                    "starttime": body_object.starttime,
                    "endtime": body_object.starttime,
                    "userid": body_object.userid,
                    "resultsid": resultsid,
                    "data": seedData.ResultsDailyTrend
                }

                data.addPowerAnalysisTrendJob(response_post, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {

                        //res.status(201).send(response_post);
                    }
                });

                //ADD TO DB
                data.addPowerAnalysisTrendResults(analysis_results, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Analysis results succesfully added!");
                        var del = delete analysis_results._id;
                        console.log(del);
                        res.set("Content-Type", "application/json");
                        var del_resultsid = delete analysis_results.resultsid;
                        console.log(analysis_results);
                        res.status(200).send(analysis_results);
                    }
                });
            }
        }
        else {
            //Not implemented yet, try to set Test to true
            var err_msg = {
                "code": 0,
                "message": "No real data yet, try to set Test=true for test data",
                "fields": "Test"
            };

            res.status(500).send(err_msg);
        }

    }

    poweranalysistrend.get_dailytrend_result = function (req, res, next) {
        var id = 0;
        var isTest = false;
        id = req.swagger.params.resultsid.value;
        isTest = req.swagger.params.test.value === "" ? true : req.swagger.params.test.value;

        if (isTest) {
            data.getPowerAnalysisTrendResults(id, function (err, analysisResults) {
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
                        var any_response_get = {
                            "energyhubid": "123",
                            "starttime": "2016-10-10T10:54:38.202Z",
                            "endtime": "2016-10-10T10:54:38.202Z",
                            "userid": "654",
                            "data": seedData.ResultsDailyTrend
                        };
                        res.status(200).send(any_response_get);
                    }
                    else {
                        res.set("Content-Type", "application/json");
                        //Object found with results -> 200 
                        console.log(typeof resultsData.data.weekdays);
                        if (typeof resultsData.data.weekdays !== 'undefined') {
                            var del = delete resultsData._id;
                            var del_resultsid = delete resultsData.resultsid;
                            res.send(resultsData);
                        }
                        else {
                            //No results yet -> 404 
                            var no_res_err = {
                                "resultsid": id,
                                "analysismodel": "POWERANALYSISDAY",
                                "processingstatus": "PENDING",
                                "resultslink": "/poweranalysisday/" + resultsData.resultsid
                            };
                            
                            res.status(404).send(no_res_err);
                        }

                    }
                }
            });
        }
        else {
            //Not implemented yet, try to set Test to true
            var err_msg = {
                "code": 0,
                "message": "No real data yet, try to set Test=true for test data",
                "fields": "Test"
            };

            res.status(500).send(err_msg);
        }
    }

    function getCorrectReq(req) {
        var body_object = {
            energyhubid: "",
            starttime: "",
            endtime: "",
            userid: "",
            //daytype: "",
            isTest: false
        }

        if (req.swagger && req.swagger.body) {
            console.log('---------------- SWAGGER');
            console.log(req.swagger.body)
            console.log('---------------- POSTMAN BODY');
            console.log(req.body);
            body_object.energyhubid = req.swagger.body.energyhubid;
            body_object.starttime = req.swagger.body.starttime;
            body_object.endtime = req.swagger.body.endtime;
            body_object.userid = req.swagger.body.userid;
            //body_object.daytype = req.swagger.body.daytype;
            body_object.isTest = req.swagger.params.test.value;
        }
        else {
            console.log('---------------- POSTMAN');
            //console.log(req.body); 
            body_object.energyhubid = req.body.energyhubid;
            body_object.starttime = req.body.starttime;
            body_object.endtime = req.body.endtime;
            body_object.userid = req.body.userid;
            //body_object.daytype = req.body.daytype; 
            body_object.isTest = typeof req.query.test === 'undefined' ? false : req.query.test !== "false";
        }

        return body_object; 
    }

})(module.exports);