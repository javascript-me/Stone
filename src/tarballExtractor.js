var tarball = require('tarball-extract');
tarball.extractTarball('target/image-home-0.0.2.tgz', 'target/image-home', function(err){
    if(err) console.log(err)
})