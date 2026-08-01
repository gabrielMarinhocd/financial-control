module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage'),
        require('karma-jasmine-html-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        jasmine: {},
        clearContext: false
      },
      jasmineHtmlReporter: {
        suppressAll: true
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/financial-control'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'text-summary' },
          { type: 'lcovonly', file: 'lcov.info' }
        ]
      },
      reporters: ['progress', 'kjhtml'],
      browsers: ['ChromeHeadless'],
      restartOnFileChange: true
    });
  };