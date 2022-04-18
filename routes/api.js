/**
 * dependencies
 */
var express = require('express'),
    router = express.Router(),
    moment = require('moment');

/**
 * Routes
 */
router.get('/time', function(req, res) {
    // read the query
    var query = req.query;
    var tz = query['timezone'];

    // convert the local timezone to utc
    var now = moment().utc();

    // check if a timezone is given
    if(tz != undefined) {
        // set the time zone given by the request
        now.utcOffset(parseInt(tz));
    } else{
        // use the time zone set by the post request
         now.utcOffset(parseInt(global.timezone));
        console.log("global " + global.timezone);
    }

    // format the timezone and return result as json
    var timeFormat =  now.format("H:mm:ss-E/MM/YYYY");
    var timezoneFormat = now.format("Z");

    res.text(now);
//     res.json(
//         {
//             time: timeFormat ,
//             time: now,
//             timezone: timezoneFormat
//         }
//     );
});

// Post Request
router.post('/time', function (req, res) {
    //set the global timezone via post request
    global.timezone =  req.body["timezone"];
    console.log("global " + global.timezone);

    // redirection didn't work  :(
    res.redirect(200,"/api/time");
   // res.json(200);
});

// render the form
router.get('/', function(req, res) {
    res.render('timezone', {title: 'Set Timezone'});
});

// Return router
module.exports = router;
