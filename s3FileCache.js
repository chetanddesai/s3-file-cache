var s3 = require('s3');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');

// Tip from s3 module: Consider increasing the socket pool size
// in the http and https global agents. This will improve bandwidth
// when using uploadDir and downloadDir functions. For example:
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 20;

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  }
});

module.exports = s3FileCache = {};

s3FileCache.getDir = function(localBaseDir, requestDir, bucket, cb) {

  // If I can access the dir, don't need to sync it from s3
  var returnDir = path.join(localBaseDir,requestDir);
  fs.open(returnDir, 'r', function (err) {
    if (!err) {
      return cb(null, returnDir);
    }

    console.log('Cache miss, download: '+returnDir);
    // It isn't accessible
    var params = {
      localDir: path.join(localBaseDir,requestDir),
      s3Params: {
        Bucket: bucket,
        Prefix: requestDir,
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };
    var downloader = client.downloadDir(params);
    downloader.on('error', function(err) {
			console.error("unable to download:", err.stack);
      return cb(err);
		});
		downloader.on('progress', function() {
			console.log("progress", downloader.progressAmount, downloader.progressTotal);
		});
		downloader.on('end', function() {
			console.log("done downloading");
      return cb(null, returnDir);
		});
  });
};
