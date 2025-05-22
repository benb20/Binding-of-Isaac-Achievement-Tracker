// Achievements:
// https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=250900&key=71398303BB9D546470CE557C1741EF65&steamid=76561198355275849
// Images, etc:
// http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=71398303BB9D546470CE557C1741EF65&appid=250900&l=english&format=json
// Key:
// 71398303BB9D546470CE557C1741EF65
// Domain Name:
// localhost

const key = '17FB17A57FAF987A9E46B470BE397EC4'
var express = require('express') // Express
var app = express();
var port = 3000;
var axios = require('axios')
var passport = require('passport');
var session = require('express-session');
var passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;
var achs;
var achInfo;
var achDetail; 
var chars = ["Isaac", "Magdalene", "Cain", "Judas", "???", "Eve", "Samson", "Azazel", "Lazarus", "Eden", "The Lost", "Lilith", "Keeper", "Apollyon", "The Forgotten", "Bethany", "Lazarus", "Jacob and Esau", "Tainted Isaac", "Tainted Magdalene", "Tainted Cain", "Tainted Judas", "Tainted ???", "Tainted Eve", "Tainted Samson", "Tainted Azazel", "Tainted Lazarus", "Tainted Eden", "Tainted Lost", "Tainted Lilith", "Tainted Keeper", "Tainted Apollyon", "Tainted Forgotten", "Tainted Bethany", "Tainted Jacob"];

app.use(express.static('public'))
app.set('views','./views')
app.set('view engine', 'ejs')

// Initiate Strategy
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
    realm: 'http://localhost:' + port + '/',
    apiKey: key
    }, function (identifier, profile, done) {
        process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
        });
    }
));

app.use(session({
    secret: 'youfucker',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 3600000
    }
}))
app.use(passport.initialize());
app.use(passport.session());

//////////////////////////// Functions /////////////////////////////////////////

function getAchievements(ID) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=250900&key='+key+'&steamid='+ID)
        .then(result => {
            json = result.data['playerstats']['achievements']
            function mycomparator(a,b) {
            return parseInt(a.apiname, 10) - parseInt(b.apiname, 10);
            }
            json.sort(mycomparator);
              
            resolve(json);
        })
        .catch(error => {
            console.log(error);
        });
    })
}

function getInfo() {
    return new Promise((resolve, reject) => {
        axios.get('http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key='+key+'&appid=250900&l=english&format=json')
        .then(result => {
            json = result.data['game']['availableGameStats']['achievements']
            function mycomparator(a,b) {
                return parseInt(a.name, 10) - parseInt(b.name, 10);
            }
            json.sort(mycomparator);
                  
            resolve(json);
        })
        .catch(error => {
            console.log(error);
        });
    })
}

function getDetail() {
    return new Promise((resolve, reject) => {
        let data = require('./public/files/Achievements.json');
        resolve(data);
    })
}

function clean(info){ 
    for(var i = 0; i < info.length; i++){ 
        unlock = info[i]['unlock'] 
        try { //defeat ...
            boss = unlock.match(new RegExp("Defeat " + "(.*)" + " as"));
            char = unlock.match(new RegExp(" as "+ "(.*)"));
            info[i]["boss"] = boss[1];
            info[i]["char"] = char[1];
            info[i]["type"] = "boss";
        } catch(err) {
            try { //complete boss rush ...
                boss = unlock.match(new RegExp("Complete the " + "(.*)" + " as"));
                char = unlock.match(new RegExp(" as "+ "(.*)"));
                info[i]["boss"] = boss[1];
                info[i]["char"] = char[1];
                info[i]["type"] = "boss";
            } catch(err) {
                try { //greed mode ...
                    greed = unlock.match(new RegExp("Complete " + "(.*)" + " as"));
                    char = unlock.match(new RegExp(" as "+ "(.*)"));
                    info[i]["mode"] = greed[1];
                    info[i]["char"] = char[1];
                    info[i]["type"] = "greed";
                } catch(err) {
                    info[i]["type"] = "other";
                    continue;
                }
            }
        }
    }
    return info;
}
////////////////////////////// Routes ////////////////////////////////////////

app.get("", function (req, res) {
    res.render('index', { user: req.user, achInfo: achInfo, chars: chars});
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.get("/achievements", function (req, res) {
    axios.get('https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=250900&key='+key+'&steamid=76561198355275849')
    .then(result => {
        res.send(result.data['playerstats']['achievements']);
    })
    .catch(error => {
        console.log(error);
    });
});

////////////////////////////// STEAM API ////////////////////////////

app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}));
app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), async function (req, res) {
    var id = req.user['_json']['steamid'];
    achs = await getAchievements(id);
    achInfo = await getInfo();
    achDetail = await getDetail();
    
    // Create a map of achievement details by name for easier lookup
    const achDetailMap = {};
    achDetail.forEach(detail => {
        achDetailMap[detail.Name] = detail;
    });

    // Merge the data safely
    for(var i = 0; i < achInfo.length; i++){
        const achievementName = achInfo[i].displayName;
        const detail = achDetailMap[achievementName];
        
        if (detail) {
            achInfo[i]['achieved'] = achs[i] ? achs[i]['achieved'] : 0;
            achInfo[i]['unlock'] = detail['Unlock'];
            achInfo[i]['link'] = detail['link'];
            achInfo[i]['rating'] = detail['rating'];
        } else {
            console.warn(`No detail found for achievement: ${achievementName}`);
            achInfo[i]['achieved'] = achs[i] ? achs[i]['achieved'] : 0;
            achInfo[i]['unlock'] = 'Unknown unlock condition';
            achInfo[i]['link'] = '';
            achInfo[i]['rating'] = null;
        }
    }
    
    achInfo = clean(achInfo);
    res.redirect('/');
});

// Required to get data from user for sessions
passport.serializeUser((user, done) => {
    done(null, user);
   });
passport.deserializeUser((user, done) => {
    done(null, user);
});


app.listen(port, 'localhost',()=> {
    console.info('listening on port ' + port);
});