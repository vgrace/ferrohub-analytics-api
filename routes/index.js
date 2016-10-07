var express = require('express');
var router = express.Router();
var analysis = require('../api/controllers/poweranalysisday'); 

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/analytics/v0_1_0/poweranalysisday', function (req, res) {
    //res.send({ test: 'Hello handsome: ' + req.query.test });
    analysis.create_poweranalysisday_analysis(req, res, function () {
        console.log('POST'); 
    });
})

router.get('/analytics/v0_1_0/poweranalysisday/:resultsid', function (req, res) {
    var id = req.params.resultsid;
    //res.send({ test: 'Get analytics - test: ' + req.query.test + ', id: ' + id }); 
    analysis.get_poweranalysisday_result(req, res, function () {
        console.log('GET'); 
    }); 
});

router.post('/analytics/testing/:id', function (req, res) {
    analysis.testing(req, res, function () {
        console.log('testing');
    });
});

//router.post('/api/controllers/poweranalysisday', create_poweranalysisday_analysis);
//router.post('/api/puppies', db.createPuppy);

module.exports = router;