module.exports = {
  deploy: {
    root: 'build',
    index: 'build/index.html',
    scripts: 'build/scripts',
    css: 'build/css',
    templates: 'build/views',
    fonts: 'build/fonts',
    assets: 'build/assets',
    vendor: 'build/vendor'
  },

  app: {
    index: 'public/index.html',
    html: [
      'public/views/*.html',
      'public/views/**/*.html'
    ],
    sass: 'public/scss',
    assets: [
      'public/assets/*',
      'public/assets/**/*',
    ],
    scripts: [
      'public/scripts/**/*.js',
      'public/scripts/**/**/*.js',
      'public/scripts/*.js'
      ],
    fonts: 'public/fonts/*',
  },

  vendor: {
    js: [
      'public/vendor/jquery/dist/jquery.js',
      'public/vendor/angular/angular.js',
      'public/vendor/angular-route/angular-route.js',
      'public/vendor/angular-ui-router/release/angular-ui-router.js',
      'public/vendor/angular-cookies/angular-cookies.min.js',
      'public/vendor/bootstrap/dist/js/bootstrap.js',
      'public/vendor/angular-animate/angular-animate.js',
      'public/vendor/angular-touch/angular-touch.js',
      'public/vendor/angular-bootstrap/ui-bootstrap.js',
      'public/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'public/vendor/lodash/dist/lodash.js',
      'public/vendor/restangular/dist/restangular.js',
    ],
    css: [
      'public/vendor/bootstrap/dist/css/bootstrap.min.css',
      'public/vendor/components-font-awesome/css/font-awesome.css'
    ],
    fonts: [
      'public/vendor/components-font-awesome/fonts/*',
      'public/vendor/bootstrap/dist/fonts/*',
    ],
    maps: [
      'public/vendor/bootstrap/dist/css/bootstrap.min.css.map'
    ],
    mapsJs: [
      'public/vendor/angular-cookies/angular-cookies.min.js.map'
    ],

    assets: [

    ]
  },
}
