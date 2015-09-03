window.$ = require('jquery');

require('angular');
require('angular-ui-router');
require('angular-xeditable');

require('./config.js')

require('./filters/hide_protocol');
require('./services/profile');
require('./controllers/username');
require('./controllers/resume');

