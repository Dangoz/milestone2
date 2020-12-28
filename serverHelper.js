const fs = require("fs"),
  { unzip, readDir, grayScale } = require("./milestone1/IOhandler"),
  path = require('path');


// check for request url, stream the requested file as response
const responseFile = (req, res) => {

  // main page html, or upload page html, or other assosicated files.
  if (req.url === '/favicon.ico' || req.url === '/') {
    let stream = fs.createReadStream(path.join(__dirname, 'main.html'));
    stream.pipe(res);
  } else if (req.url === '/upload') {
    let stream = fs.createReadStream(path.join(__dirname, 'webfile/upload.html'));
    stream.pipe(res);
  } else {
    let stream = fs.createReadStream(__dirname + req.url);
    stream.pipe(res);
  }
};

// apply grayscale to newly uploaded photos in gallery
const processGrayscale = () => {
  return new Promise((resolve, reject) => {

    // an array of uploaded photos 
    readDir('gallery')
    .then(gallery => {

      // an array of uploaded photos that are grayscaled
      return readDir('galleryGrayscale')
      .then(galleryGrayscale => {

        // find the photos that are not yet grayscaled, then apply grayscale
        for (let photo of gallery) {
          if (!galleryGrayscale.includes('galleryGrayscale/' + path.basename(photo))) {
            grayScale(photo, path.join(__dirname, 'galleryGrayscale'));
          }
        }
      });
    })
    .then(() => resolve())
    .catch(err => reject(err));
  });
};


// update newly added photos/grayscaled photos to gallery display
const updateGallery = (req, res, photos) => {
  if (req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });

    // response each photo in gallery & galleryGrayscale to client mainpage
    for (let photo of photos) {
        res.write(`<body><img class='photo' src=${photo}></body>`);
        res.write(`<body><img class='photo' src=${path.join('galleryGrayscale', path.basename(photo))}></body>`);
    }
  }
};

module.exports = {
  responseFile,
  processGrayscale,
  updateGallery
};