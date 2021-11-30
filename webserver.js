const http = require('http')
const fs = require('fs')
const URL = require('url')
http.createServer(function (req, res) {
  let url = URL.parse(req.url,true);
  if (url.pathname === "/") url.pathname = 'index.html'
  file = './' + url.pathname
  let cType = 'text/html'
  if (file.endsWith('.js')) cType = 'text/javascript'
  else if (file.endsWith('.css')) cType = 'text/css'
  else if (file.endsWith('.png')) cType = 'image/png'
  else if (!file.endsWith('.html')) cType = 'text/plain'
  res.writeHead(200,{'Content-Type':cType+'; charset=utf-8'})
  fs.promises.readFile(file)
  .catch((e) => {
	  res.writeHead(404,{'Content-Type':'text/plain'})
	  res.end('Error 404: File Not Found')
  })
  .then((data) => {
	  //console.info(file, data.slice(0, 50).toString(), cType, '\n\n\n\n\n\n')
	  res.end(data)
  })
}).listen(8080)