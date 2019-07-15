/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

var QRCode = require('qrcode')
const fs = require('fs');
const imgurUploader = require('imgur-uploader');
var base64Img = require('base64-img');

module.exports = app => {

  app.log('Yay, the app was loaded!')

  app.on('pull_request.opened', async context => {
    const branch = context.payload.pull_request.head.ref
    const thorLink = "http://" + branch + ".thorhudl.com"

    const qr64bit = await createQr64(thorLink);
    const imgpath = await convert64ToImg(qr64bit);
    const imgurLink = await uploadToImgur(imgpath);

    const message = 'Here is your QR Code for: <br>' + thorLink.toLowerCase() + '<br><img src="' + imgurLink + '"/>'
    app.log("MESSAGE: " + message)

    const issueComment = context.issue({ body: message })

    return context.github.issues.createComment(issueComment)
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