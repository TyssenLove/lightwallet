// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        '../e2e/**/*.e2e-spec.ts'
    ],
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: ['--headless', '--disable-gpu', '--window-size=800,800', '--no-sandbox']
        }
    },
    directConnect: true,
    baseUrl: 'http://localhost:8100/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        // print: function() {}
    },
    useAllAngular2AppRoots: true,
    beforeLaunch: function() {
        require('ts-node').register({
            project: 'e2e',
            compilerOptions: {
                lib: [
                    'esnext'
                ]
            }
        });
    },
    onPrepare: function() {
        jasmine.getEnv().addReporter(new SpecReporter());
    }
};
