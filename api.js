const Homey = require('homey');
const digest = require('http-digest-client');

spcRequest = function(method, uri, callback) {
    var gw_data = Homey.ManagerSettings.get('spc_bridge_data');
    if (gw_data == null) return callback('gw_data_not_defined', false);

    var user, password;
    if (method == 'GET') {
        user = gw_data.get_user;
        password = gw_data.get_password;
    } else if (method == 'PUT') {
        user = gw_data.put_user;
        password = gw_data.put_password;
    } else {
        return callback('invalid_method', false);
    }

    var spc_http_client = digest.createClient(user, password, true);
    var options = {
        host: gw_data.bridge_ip,
        port: gw_data.bridge_port,
        path: '/spc/' + uri,
        method: method
    }
    var reply = "";

    var req = spc_http_client.request(options, function(res, err) {
        if (err) {
            callback('invalid_http_request', false);
        } else {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                reply += chunk;
            });
            res.on('end', function() {
                if (reply && callback) callback(false, reply);
            });
        }
    });
}

module.exports = [
    {
        method: 'GET',
        path: '/getAreas/',
        public: false,
        fn: function(args, callback) {
            spcRequest('GET', 'area', callback);
        }
    },
    {
        method: 'GET',
        path: '/getZones/',
        public: false,
        fn: function(args, callback) {
            spcRequest('GET', 'zone', callback);
        }
    },
    {
        method: 'GET',
        path: '/getPanels/',
        public: false,
        fn: function(args, callback) {
            spcRequest('GET', 'systemlog', callback);
        }
    }
]
