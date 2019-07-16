/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

 //requires
const QRCode = require('qrcode')
const fs = require('fs');
const imgurUploader = require('imgur-uploader');
const base64Img = require('base64-img');

//internal require
const util = require('./qrutil')

module.exports = app => {

  app.log('ThorQRBot is Running!')

  app.on('pull_request.labeled', async context => {

     const labelname = context.payload.label.name;

    if (labelname == "Show Thor QR") {
      const branch = context.payload.pull_request.head.ref
      const thorLink = "http://" + branch + ".thorhudl.com"

      const qr64bit = await util.createQr(thorLink)
      app.log("QR string created")
      const imgpath = await util.convertToImg(qr64bit)
      app.log("Image Saved at: " + imgpath)
      const imgurLink = await util.uploadToImgur(imgpath)
      app.log("Image Uploaded to: " + imgurLink)

      const message = 'QR Code for: <br>' + thorLink.toLowerCase() + '<br><img src="' + imgurLink + '"/>'

      const issueComment = context.issue({
        body: message
      })

      app.log("-----QR Code Posted-----");``

      return context.github.issues.createComment(issueComment)
    }
  })
}