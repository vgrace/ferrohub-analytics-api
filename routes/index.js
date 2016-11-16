var express = require('express');
var router = express.Router();
//var analysis = require('../api/controllers/poweranalysisday'); 
var crypto = require('crypto');
var data = require('../data');

///* GET home page. */
//router.get('/', function (req, res) {
//    res.render('index', { title: 'Express' });
//});

//router.post('/analytics/v0_1_0/poweranalysisday', function (req, res) {
//    //res.send({ test: 'Hello handsome: ' + req.query.test });
//    analysis.create_poweranalysisday_analysis(req, res, function () {
//        console.log('POST'); 
//    });
//})

//router.get('/analytics/v0_1_0/poweranalysisday/:resultsid', function (req, res) {
//    var id = req.params.resultsid;
//    //res.send({ test: 'Get analytics - test: ' + req.query.test + ', id: ' + id }); 
//    analysis.get_poweranalysisday_result(req, res, function () {
//        console.log('GET'); 
//    }); 
//});

router.get('/analytics/poweranalysisdayresults/:resultsid', function (req, res, next) {
    console.log(req.params.resultsid);
    //res.send({hello: 'This is a test you handsome devil'});
    next(null, {hello: 'This is a test you handsome devil'}); 
});

router.post('/analytics/poweranalysisdayjob', function (req, res) {
    var resultsid = crypto.randomBytes(20).toString('hex');//"b136e4f5a6a9a42cc02ddc9c217a51b9b22be8c4"; //

    // Create job
    var job = {
        "energyhubid": req.body.energyhubid, //[INDATA, t.ex "78:a5:04:ff:40:bb"],
        "starttime": req.body.starttime, //[INDATA],
        "endtime": req.body.endtime, //[INDATA] ,
        "userid": req.body.userid, //[INDATA],
        "resultsid": resultsid, //[GUID GENERERAT AV REST-API, en string],
        "analysismodel":"POWERANALYSISDAY"
    };
    // Save job to local db
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
    getResults(resultsid, testing);

    function testing(err, results) {
        if (err) {
            console.log(err);
            res.send({ message: err });
        }
        else {
            if (results.value === null) {
                //No data yet call again
                console.log("No data yet, call again");
                getResults(resultsid, testing);
            }
            else {
                //Found data
                console.log("Data found"); 
                res.send(results.value); 
            }
        }
    }
});


function getResults(resultsId, next) {
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
//router.post('/api/controllers/poweranalysisday', create_poweranalysisday_analysis);
//router.post('/api/puppies', db.createPuppy);

module.exports = router;