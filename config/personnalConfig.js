module.exports.personnalConfig = {

    sitename: "Your sitename",
    siteUrl: "http://Your-domaine.com",
    siteLogo50x: "/images/logo/logo50x50.png",
    allowSignup: false,
    DsApiUrl : {
        protocol: 'http://',
        host: '127.0.0.1',
        port: '9000'
    },
    pagination : {
        drivers : {
           frontend: {
               limit: 20
           },
           admin: {
               limit: 20
           }
        },
        results: {
            frontend: {
                limit: 20
            }
        },
        laps: {
            admin: {
                limit: 20
            }
        },
        cars: {
            admin: {
                limit: 20
            }
        },
        tracks: {
            admin: {
                limit: 20
            }
        },
        sessions: {
            admin: {
                limit: 20
            }
        },
        events: {
            frontend: {
                limit: 4
            }
        }
    }

};
