/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

const QRCode = require('qrcode')
const fs = require('fs');
const imgurUploader = require('imgur-uploader');
const base64Img = require('base64-img');

module.exports = app => {

  //Displays when app is initialized
  app.log('ThorQRBot is Running!')

  app.on('pull_request.labeled', async context => {

     constlabelname = context.payload.label.name;

    if (labelname == "Show QR") {
      const branch = context.payload.pull_request.head.ref
      const thorLink = "http://" + branch + ".thorhudl.com"

      const qr64bit = await createQr64(thorLink);
      const imgpath = await convert64ToImg(qr64bit);
      const imgurLink = await uploadToImgur(imgpath);

      const message = 'Here is your QR Code for: <br>' + thorLink.toLowerCase() + '<br><img src="' + imgurLink + '"/>'

      const issueComment = context.issue({
        body: message
      })

      app.log("QR CODE POSTED!");

      return context.github.issues.createComment(issueComment)
    }
  })

  function convert64ToImg(img) {

    return new Promise(function (resolve, reject) {
      base64Img.img(img, '', 'qrcodeimage', function (err, filepath) {
        app.log("Image converted, saved at: " + filepath)
        if (err) return reject(err);
        resolve(filepath);
      });
    });
  }

  function uploadToImgur(path) {

    return new Promise(function (resolve, reject) {
      imgurUploader(fs.readFileSync(path), {
        title: 'qrcode'
      }).then(data => {
        const fullLink = "https://imgur.com/" + data.id + ".png";
        app.log("Uploaded to : " + fullLink);
        resolve(fullLink);
      });
    });
  }

  function createQr64(link) {

    return new Promise(function (resolve, reject) {
      QRCode.toDataURL(link, function (err, url) {
        app.log("QR Code created in base 64: " + url)
        if (err) return reject(err);
        resolve(url);
      });
    });
  }

}