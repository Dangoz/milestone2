/* 
 * Project: COMP1320 Milestone 1 
 * File Name: main.js 
 * Description: 
 * 
 * Created Date: 
 * Author:
 * 
 */ 

const { unzip, readDir, grayScale } = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

// main operation, unzip file to directory -> array of png -> grayscale each png to directory
unzip(zipFilePath, pathUnzipped)
.then((msg) => {
  console.log(msg);
  return readDir(pathUnzipped);
})
.then(list => {
  for (let png of list) {
    grayScale(png, pathProcessed);
  }
}) 
.catch(err => console.log(err));