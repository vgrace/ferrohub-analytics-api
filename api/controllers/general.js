(function (general) {
    var crypto = require('crypto');
    var data = require('../../data');
    var seedData = require('../../data/seedData');

    general.get_status = function (req, res, next) {
        var isTest = req.swagger.params.test.value === "" ? true : req.swagger.params.test.value;
        var analysistype = req.swagger.params.analysistype.value === "" ? true : req.swagger.params.analysistype.value;
        res.set("Content-Type", "application/json");

        // TEST
        if (isTest) {
            var restest = [
                  {
                      "energyhubid": id,
                      "starttime": "2017-02-16T23:00:00.000Z",
                      "endtime": "2017-02-22T23:00:00.000Z",
                      "userid": "457",
                      "histtype": "scatter",
                      "resultsid": "f413cb636b9206d5b62eafc07cb3b441d6d2fa02",
                      "analysismodel": "LOADEVENTDETECTION",
                      "processingstatus": "PENDING",
                      "resultslink": "http://dev.ferroamp.se/analytics/v0_1_3/loadeventdetection/f413cb636b9206d5b62eafc07cb3b441d6d2fa02"
                  },
                  {
                      "energyhubid": id,
                      "starttime": "2017-02-16T23:00:00.000Z",
                      "endtime": "2017-02-22T23:00:00.000Z",
                      "userid": "457",
                      "histtype": "scatter",
                      "resultsid": "f413cb636b9206d5b62eafc07cb3b441d6d2ds45",
                      "analysismodel": "LOADEVENTDETECTION",
                      "processingstatus": "PENDING",
                      "resultslink": "http://dev.ferroamp.se/analytics/v0_1_3/loadeventdetection/f413cb636b9206d5b62eafc07cb3b441d6d2ds45"
                  }
            ];
            res.status(200).send(restest);
        }
        else {
            console.log(analysistype);
            data.get_jobs(analysistype, function (err, results) {
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
                    res.status(200).send(results);
                }
            });
        }
    }

})(module.exports);