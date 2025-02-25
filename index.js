const { WebSocketServer } = require('ws');
const L = require("list");
const wss = new WebSocketServer({ port: 5034 });
var users = L.list();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  var usr = "";
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    var datas = data.toString().split('|');
    if (datas[0] == 'LOGON') {
        wss.clients.forEach(client => {
              client.send('ACCEPTLOGON|'+datas[1], 'utf-8');
          });
          users = L.append(datas[1].toUpperCase(), users);
          usr = datas[1].toUpperCase();
          var s = "";
          var i = true;
          L.toArray(users).forEach(e => {
            if (i == true) {
                s += e;
                i = false;
            } else {
                s += ','+e;
            }
          });
          console.log(L.toArray(users));
          wss.clients.forEach(client => {
            client.send('USERS|' + s, 'utf-8');
        });
    } else if (datas[0] == 'MSG') {
        wss.clients.forEach(client => {
              client.send('MSG|'+datas[1].toString().toUpperCase()+"|"+datas[2], 'utf-8');
          }); 
    } else if (datas[0] == 'PING') {
        wss.clients.forEach(client => {
            client.send('PING|'+datas[1].toString().toUpperCase(), 'utf-8');
        }); 
    }
  });

    ws.on('close', e => {
        var xyz = L.toArray(users);
        xyz.splice(xyz.indexOf(usr));
        users = L.from(xyz);
          var s = "";
          var i = true;
          L.toArray(users).forEach(e => {
            if (i == true) {
                s += e;
                i = false;
            } else {
                s += ','+e;
            }
          });
          console.log(L.toArray(users));
          wss.clients.forEach(client => {
            client.send('USERS|' + s, 'utf-8');
        });
    })
  
});