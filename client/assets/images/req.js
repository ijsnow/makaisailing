fs = require('fs');
FormData = require('form-data');
http = require('http');

fs.readFile('./makaisailing-1.jpg', function (err,data) {
    if (err) {
      return console.log(err);
    }
    //console.log(data);
    var form = new FormData();
    form.append('image', fs.createReadStream('./makaisailing-1.jpg'));

    var options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/admin/image',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;boundary=' + form.getBoundary(),
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNDcxMjEyMzQwLCJuYW1lIjoiaXNhYWMxIn0.jVkAYrplkIovGqPthNNg2ixRb6p9oWv8oyHBIwhmfdk'
      }
    };

    var req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    form.pipe(req);
});
