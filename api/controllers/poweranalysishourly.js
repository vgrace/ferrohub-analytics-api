
(function (poweranalysishourly) {
    var crypto = require('crypto');
    var data = require('../../data');
    var seedData = require('../../data/seedData');

    // POST /hourlypower: operationId: make_poweranalysishourly
    poweranalysishourly.make_poweranalysishourly = function (req, res, next) {
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
                "resultsid": resultsid,
                "data": seedData.ResultsHourly
            };
            res.status(200).send(analysis_results);
        }
        // REAL (TEST = false)
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
                "resultsid": id,
                "data": seedData.ResultsHourly
            };
            res.status(200).send(any_response);
        }
        // REAL (TEST = false)
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
})(module.exports);