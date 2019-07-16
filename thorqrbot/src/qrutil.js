const QRCode = require('qrcode')
const fs = require('fs');
const imgurUploader = require('imgur-uploader');
const base64Img = require('base64-img');

module.exports = {
  convertToImg: function imgFrom64(img) {

    return new Promise(function (resolve, reject) {
      base64Img.img(img, '', 'qrcodeimage', function (err, filepath) {
        if (err) return reject(err);
        resolve(filepath);
      });
    });
  },

  uploadToImgur: function upToImgur(path) {

    return new Promise(function (resolve, reject) {
      imgurUploader(fs.readFileSync(path), {
        title: 'qrcode'
      }).then(data => {
        const fullLink = "https://imgur.com/" + data.id + ".png";
        resolve(fullLink);
      });
    });
  },

  createQr: function createQR64(link) {

    return new Promise(function (resolve, reject) {
      QRCode.toDataURL(link, function (err, url) {
        if (err) return reject(err);
        resolve(url);
      });
    });
  }
}