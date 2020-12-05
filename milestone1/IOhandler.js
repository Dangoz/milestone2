/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

const unzipper = require('unzipper'),
  fs = require("fs"),
  fsP = require("fs").promises,
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))

      // reject on error, resolve after extract.
      .on('error', err => reject(err))
      .on('finish', () => resolve("Extraction operation complete"));
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  return new Promise((resolve, reject) => {
    fsP.readdir(dir)
    .catch(err => reject(err))
    .then(files => {
      let li = [];

      // loop through all files in dir, and push .png files to list.
      for (let file of files) {
        if (file.slice(-4, file.length) == ".png") {
          li.push(path.join(dir, file));
        }
      }
      resolve(li);
    });
  });
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
    .pipe(new PNG({ filterType: 4, }))
    .on("parsed", function() {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let idx = (this.width * y + x) << 2;
  
          // get value of RGB
          let red = this.data[idx];
          let green = this.data[idx + 1];
          let blue = this.data[idx + 2];
  
          // get value of gray and apply gray back to RGB
          let gray = (red + green + blue) / 3;
          this.data[idx] = gray;
          this.data[idx + 1] = gray;
          this.data[idx + 2] = gray;
        }
      }
  
      // pack to png and write to directory
      console.log(`writing to ${path.join(pathOut, path.basename(pathIn))}`)
      this.pack().pipe(fs.createWriteStream(path.join(pathOut, path.basename(pathIn))));
    })

    // reject on error, resolve after grayscale written
    .on('error', err => reject(err))
    .on('finish', () => resolve("Extraction operation complete"));
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};