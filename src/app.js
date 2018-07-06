var express = require('express');
var app = express();
var imports = require('./router.js')

app.use('/', imports);

app.listen(3000, function () {
    console.log('listen 3000 port');
})
