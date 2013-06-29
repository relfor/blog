var etc = require('../helpers/etc');
var AirForm = require('../helpers/air-form');

exports.get = function (req, res) {

    etc.startMongoDB('Articles', function (err, Articles, db) {
        if (err) {
            return res.send(500, etc.msg.server_problem);
        }
        Articles.find({published: true}, {}, { limit: 4, sort: {
            'created': -1
        }}).
            toArray(function (err, results) {
                if (err) {
                    return res.send(500, etc.msg.server_problem);
                }
                return res.render('home.jade', {articles: results});
            });
    });

    //return res.render('home.jade', {articles: results})
    //return res.send('ok');
};

exports.infiniteScroll = function (req, res) {
    var af = new AirForm(req);

    var last_link = af.xvalidate('last_link', 'query');
    var timestamp = parseInt(af.xvalidate('timestamp', 'query', {'has to be': ['int']}));

    if (af.noneNull([last_link, timestamp]))
        etc.startMongoDB('Articles', function (err, Articles, db) {
            if (err) {
                return res.json(etc.json.empty);
            }
            Articles.find({created: {$lte: timestamp}, published: true, _id: {$ne: last_link}}, {}, { limit: 3, sort: {
                'created': -1
            }}).
                toArray(function (err, results) {
                    if (err) {
                        return res.json(etc.json.empty);
                    }

                    return res.json({more_articles: results});
                });

        });
};