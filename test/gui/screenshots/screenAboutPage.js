const Pageres = require('pageres'),
      cl = require('node-cl-log'),
      path = require('../../../configs/path.json');

const pageres = new Pageres({delay: 2})
	.src('http://localhost:8081', ['480x320', '1024x768', '1280x1024', '1920x1080'], {crop: true})
	.dest(path.scrennshotes.aboutPage)
	.run()
	.then(() => {
    cl.log('');
    cl.gre('Create sreenshotes "About" page - done');
    cl.log('');
  });

module.exports = pageres;