# S3 File Cache
A simple file cache that uses s3 as the origin.

# Install

```
$ npm install s3-file-cache --save
```

# Downloading a Directory

```javascript
var s3FileCache = require('s3-file-cache');

s3FileCache.getDir('./my-save-location','remote/directory/name','s3-bucket-name');
```

## AWS Configuration
Refer to the [AWS SDK][aws-sdk-url] for authenticating to AWS prior to using this plugin.

[aws-sdk-url]: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
