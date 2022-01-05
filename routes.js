const fs = require('fs');


const requestHandler = (req, res) => {

   const url = req.url;
   const method = req.method;
   if (url === '/') {

   res.setHeader('Content-type', 'text/html');
   res.write('<html>')
   res.write('<head><title>first server</title></head>');
   res.write('<body><form action="/message" method="POST"> <input type="text" name="message"> <button type="submit">send</button></form></body>');
   res.write('</html>')
   return res.end();
   }

   if (url === '/message' && method === 'POST'){
       const body = [];
       req.on('data', (chunk) => {
           console.log(chunk);
           body.push(chunk);
       });
       req.on('end', () => {
           const parseBody = Buffer.concat(body).toString();
           const message = parseBody.split('=')[1];
           fs.writeFileSync('message.txt', message, err => {
            res.statusCode = 302;
            res.setHeader('location','/');
            return res.end();
           });
       });
   }

   res.setHeader('Content-type', 'text/html');
   res.write('<html>')
   res.write('<head><title>first server</title></head>');
   res.write('<body><h1>You are now on other page</h1></body>');
   res.write('</html>')
}

module.exports = requestHandler;