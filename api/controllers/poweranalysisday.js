'use strict';
// Include our "db"
var crypto = require('crypto');
var db = require('../../config/db')();
var data = require('../../data');//Real db
var seedData = require('../../data/seedData'); 


// Exports all the functions to perform on the db
module.exports = { get_poweranalysisday_result, make_poweranalysisday_analysis };

//GET /poweranalysisday/{resultsid} operationId
function get_poweranalysisday_result(req, res, next) {
    var id = 0;
    var isTest = false;
    //if (req.swagger) {
    //    console.log("SWAGGER"); 
        id = req.swagger.params.resultsid.value; //req.swagger contains the path parameters
        isTest = req.swagger.params.test.value === "" ? true : req.swagger.params.test.value;
    //}
    //else {
    //    console.log("NOT SWAGGER");
    //    id = req.params.resultsid;
    //    isTest = typeof req.query.test === 'undefined' ? false : req.query.test !== "false";
    //}
    
    if (isTest) {
        data.getPowerAnalysisResults(id, function (err, analysisResults) {
            console.log("------------------------------------------------------------------- >");
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
                console.log('------------------------------ FROM MF DB');
                if (resultsData == null) {
               var any_response_post = {
                        "energyhubid": "8674654",
                        "starttime": "2016-10-07T07:49:32.762Z",
                        "endtime": "2016-10-07T07:49:32.762Z",
                        "userid": "6545",
                        "resultsid": id,
                        "data": seedData.ResultsDataArr
                    };
                    res.status(200).send(any_response_post);
                }
                else {
                    res.set("Content-Type", "application/json");
                    //Object found with results -> 200 TEST: resultsid: a8ee17b35c0019efbb53cdcea88bbca288d59687
                    if (resultsData.data.length > 0) {
                        var del = delete resultsData._id;
                        var del_resultsid = delete resultsData.resultsid;
                        console.log(del); 
                        res.send(resultsData);
                    }
                    else {
                        //No results yet -> 404 TEST: resultsid: f75c2cde1125da1cba8408c942ef712c9648e92a
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

//POST /poweranalysisday operationId
function make_poweranalysisday_analysis(req, res, next) {
    var resultsid = crypto.randomBytes(20).toString('hex');
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
                "starttime": ISODate(starttime),
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
                    var del = delete analysis_results._id;
                    var del_resultsid = delete analysis_results.resultsid;
                    
                    res.set("Content-Type", "application/json");
                    res.status(200).send(analysis_results);
                }
            });
        }
    }
    else {
        console.log(new Date("2016-10-07T07:49:32.762Z").toISOString());
        // Create job
        var job = {
            "energyhubid": energyhubid,
            "starttime": ISODate(startime),//starttime,
            "endtime": ISODate(endtime), //endtime,
            "userid": userid,
            "resultsid": resultsid,
            "analysismodel": "POWERANALYSISDAY",
            "jobstatus": 0,

            //"analysismodel": "POWERANALYSISDAY",
            //"processingstatus": "PENDING",
            //"resultslink": "string",
        };
        // Save job to local db
        //data.addPowerAnalysisJob(job, function (err) {
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
                console.log('Saved to local db')
                //res.status(201).send(job);
            }
        });

        // Poll until there is results
        getResults(resultsid, polling);

        function polling(err, results) {
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
                    console.log("No data yet, call again");
                    getResults(resultsid, polling);
                }
                else {
                    //Found data
                    console.log("Data found");
                    var del = delete results.value._id;
                    var del_resultsid = delete results.value.resultsid;
                    
                    res.send(results.value);
                }
            }
        }

        ////Not implemented yet, try to set Test to true
        //var err_msg = {
        //    "code": 0,
        //    "message": "No real data yet, try to set Test=true for test data",
        //    "fields": "Test"
        //};

        //res.status(500).send(err_msg);
    }
}

//POST w local db
function test_make_poweranalysisday_analysis(req, res, next) {
    var resultsid = crypto.randomBytes(20).toString('hex');

    // Create job
    var job = {
        "energyhubid": req.body.energyhubid, //[INDATA, t.ex "78:a5:04:ff:40:bb"],
        "starttime": req.body.starttime, //[INDATA],
        "endtime": req.body.endtime, //[INDATA] ,
        "userid": req.body.userid, //[INDATA],
        "resultsid": resultsid, //[GUID GENERERAT AV REST-API, en string],
        //"analysismodel": "POWERANALYSISDAY",
        //"jobstatus": 0,

        "analysismodel": "POWERANALYSISDAY",
        "processingstatus": "PENDING",
        "resultslink": "string",
    };
    // Save job to local db
    //data.addPowerAnalysisJob(job, function (err) {
    data.add_poweranalysisday_jobs(job, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Saved to local db')
            res.status(201).send(job);
        }
    });

    // Poll until there is results
    //getResults(resultsid, polling);

    function polling(err, results) {
        if (err) {
            console.log(err);
            res.send({ message: err });
        }
        else {
            if (results.value === null) {
                //No data yet call again
                console.log("No data yet, call again");
                getResults(resultsid, polling);
            }
            else {
                //Found data
                console.log("Data found");
                var del = delete results._id;
                var del_resultsid = delete results.resultsid;
                res.send(results.value);
            }
        }
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

//function testing(req, res, next) {
//    var id = req.params.id;
//    res.json({ success: 'Hello handsome, here is your analysis!' + id }); 
//}
