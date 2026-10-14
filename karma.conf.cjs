const path = require('path');

// Asegurar que Karma encuentre Google Chrome en Windows
if (!process.env.CHROME_BIN) {
  process.env.CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],

    files: [
      { pattern: 'tests/setup.js', watched: false },
      { pattern: 'tests/**/*.spec.js', watched: false },
      { pattern: 'src/**/*.spec.js', watched: false }
    ],

    preprocessors: {
      'tests/setup.js': ['webpack'],
      'tests/**/*.spec.js': ['webpack'],
      'src/**/*.spec.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '80' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
      devtool: 'inline-source-map'
    },

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    singleRun: true,
    concurrency: Infinity
  });
};
