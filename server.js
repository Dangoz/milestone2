const formidable = require('formidable'),
  path = require('path'),
  { responseFile, processGrayscale, updateGallery } = require('./serverHelper'),
  { unzip, readDir, grayScale } = require("./milestone1/IOhandler"),
  http = require('http');


// http server operation
const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

    // parse files uploaded from client
    const form = formidable({ multiples: true, keepExtensions: true, uploadDir: path.join(__dirname, "gallery") });
    form.parse(req, (err, fields, files) => {

      // upon png assembled by formidable, apply grayscale
      processGrayscale()
      .then(() => {

        // response webpage upload to client
        responseFile(req, res);
        res.end;
      })
    })
    return;
  }

  // reponse webpage and its assosicated files
  responseFile(req, res);

  // update client gallery display, according to pngs in gallery
  readDir('gallery')
  .then(photos => {
    updateGallery(req, res, photos);
    res.end;
  });
});

server.listen(3000, () => {
  console.log(`server listening on port http://localhost:3000`)
});
