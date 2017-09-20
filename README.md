# angular-gettext-plugin
Full Webpack plugin for angular-gettext based on the [angular-gettext-cli utility](https://github.com/huston007/angular-gettext-cli). Intended for both compilation and extraction. For details see official [developer guide for angular-gettext](https://angular-gettext.rocketeer.be/dev-guide/).

This utility can:
1. extract all you strings into a separate file of you choice
2. compile a given group of po files into the desired format

# Installation
```bash
$ npm -D i angular-gettext-plugin
```

# Example of usage
```javascript
//webpack.config.js

const AngularGetTextPlugin = require('./build/angular-gettext-plugin');
module.exports = {
  entry: './app/index.js', // your entry file
  output: {
    // your output options...
  },
  module: {
    // all your rules and loaders...
  },
  plugins: [
    new AngularGetTextPlugin({
      compileTranslations: { //optional
        input: 'po/*.po',
        outputFolder: 'l10n',
        format: 'json'
      },
      extractStrings: { //optional
        input: 'app/**/*.html',
        destination: 'po/template.pot'
        //Any of the angular-gettext-tools Extractor options
      }
    }),
    // the rest of your plugins...
  ]
}
```

# Options
Support all the configuration and options of the [angular-gettext-cli utility](https://github.com/huston007/angular-gettext-cli). Check also the [angular-gettext-tools Extractor options](https://github.com/rubenv/angular-gettext-tools#options) (for the supported extractStrings options).
