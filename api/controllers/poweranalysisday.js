'use strict';
// Include our "db"
var crypto = require('crypto');
var db = require('../../config/db')();
var data = require('../../data');//Real db
var seedData = require('../../data/seedData'); 


// Exports all the functions to perform on the db
module.exports = { get_poweranalysisday_result, make_poweranalysisday_analysis, testing };

//GET /poweranalysisday/{resultsid} operationId
function get_poweranalysisday_result(req, res, next) {
    var id = 0;
    var isTest = false;
    if (req.swagger) {
        console.log("SWAGGER"); 
        id = req.swagger.params.resultsid.value; //req.swagger contains the path parameters
        isTest = req.swagger.params.test.value;
    }
    else {
        console.log("NOT SWAGGER");
        id = req.params.resultsid;
        isTest = typeof req.query.test === 'undefined' ? false : req.query.test !== "false";
    }
    
    if (isTest) {
        data.getPowerAnalysisResults(id, function (err, analysisResults) {
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
                console.log('------------------------------ FROM MF DB');

               if (analysisResults == null) {
               var any_response_post = {
                        "energyhubid": "8674654",
                        "starttime": "2016-10-07T07:49:32.762Z",
                        "endtime": "2016-10-07T07:49:32.762Z",
                        "userid": "6545",
                        "resultsid": id,
                        "analysismodel": "POWERANALYSISDAY",
                        "processingstatus": "COMPLETED",
                        "resultslink": "/poweranalysisday/" + id,
                        "data": seedData.ResultsDataArr
                    };
                    res.status(200).send(any_response_post);

                  //   //Object not found -> 400
                   // var err_msg = {
                     //   "code": 0,
                       // "message": "No object found with resultsid: " + id,
                       // "fields": "resultsid"
                   // };
                   // res.status(400).send(err_msg);
                }
                else {
                    res.set("Content-Type", "application/json");
                    //Object found with results -> 200 TEST: resultsid: a8ee17b35c0019efbb53cdcea88bbca288d59687
                    if (analysisResults.data.length > 0) {
                        res.send(analysisResults);
                    }
                    else {
                        //No results yet -> 404 TEST: resultsid: f75c2cde1125da1cba8408c942ef712c9648e92a
                        var no_res_err = {
                            "resultsid": id,
                            "analysismodel": "POWERANALYSISDAY",
                            "processingstatus": "PENDING",
                            "resultslink": "/poweranalysisday/" + analysisResults.resultsid
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

//POST /poweranalysisday operationId
function make_poweranalysisday_analysis(req, res, next) {
    var energyhubid = "",
        starttime = "",
        endtime = "",
        userid = "",
        isTest = false;
    if (req.swagger && req.swagger.body) {
        console.log('---------------- SWAGGER');
        console.log(req.swagger.body)
        console.log('---------------- POSTMAN BODY');
        console.log(req.body);
        energyhubid = req.swagger.body.energyhubid;
        starttime = req.swagger.body.starttime;
        endtime = req.swagger.body.endtime;
        userid = req.swagger.body.userid;
        isTest = req.swagger.params.test.value;
    }
    else {
        console.log('---------------- POSTMAN');
        //console.log(req.body); 
        energyhubid = req.body.energyhubid;
        starttime = req.body.starttime;
        endtime = req.body.endtime;
        userid = req.body.userid;
        isTest = typeof req.query.test === 'undefined' ? false : req.query.test !== "false";
    }
    
    if (isTest) {
        console.log(isTest);
        req.assert('energyhubid', 'Invalid parameter: this parameter cannot be empty').notEmpty();
        req.assert('starttime', 'Invalid parameter: this parameter cannot be empty').notEmpty();
        req.assert('starttime', 'Invalid parameter: valid date required E.g. 2016-05-17T15:28:34Z').isISO8601(starttime);
        req.assert('endtime', 'Invalid parameter: this parameter cannot be empty').notEmpty();
        req.assert('endtime', 'Invalid parameter: valid date required E.g. 2016-05-17T15:28:34Z').isISO8601(endtime);
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
            console.log(errors);
            res.status(400).send(cust_error);
            return;
        }
        else {
            // CREATED - A receipt for an analysis result, contains unique id and link to where the result will be available. -> 201
            var resultsid = crypto.randomBytes(20).toString('hex');

            var response_post = {
                "energyhubid": energyhubid,
                "starttime": starttime,
                "endtime": endtime,
                "userid": userid,
                "resultsid": resultsid,
                "analysismodel": "POWERANALYSISDAY",
                "processingstatus": "PENDING",
                "resultslink": "/poweranalysisday/" + resultsid
            };

            // OK - Analysis result available. -> 200
            
            var analysis_results = {
                "energyhubid": energyhubid,
                "starttime": starttime,
                "endtime": endtime,
                "userid": userid,
                "resultsid": resultsid,
                "data": seedData.ResultsDataArr
            };

           data.addPowerAnalysisJob(response_post, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.set("Content-Type", "application/json");
                    //res.status(201).send(response_post);
                }
            });

            //ADD TO DB
            data.addPowerAnalysisResults(analysis_results, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Analysis results succesfully added!");
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

function testing(req, res, next) {
    var id = req.params.id;
    res.json({ success: 'Hello handsome, here is your analysis!' + id }); 
}
