'use strict';
const Compiler = require('angular-gettext-tools').Compiler;
const Extractor = require('angular-gettext-tools').Extractor;
const fs = require('fs');
const glob = require("glob");
const path = require("path");

function AngularGetTextPlugin(options) {
  this.compileTranslations = options.compileTranslations;
  this.extractStrings = options.extractStrings;
}

function compile(options) {
  // https://github.com/rubenv/grunt-angular-gettext/blob/master/tasks/compile.js#L7
  if (!Compiler.hasFormat(options.format)) {
    throw new Error('There is no "' + options.format + '" output format.');
  }

  const compiler = new Compiler({
    format: options.format
  });

  const filePaths = glob.sync(options.input)
  const outputs = filePaths.map( (filePath) => {
    const content = fs.readFileSync(filePath, options.encoding || 'utf-8');
    const fullFileName = path.basename(filePath);
    return {
      content: compiler.convertPo([content]),
      fileName: path.basename(filePath, path.extname(fullFileName)) + '.' + options.format
    };
  } );

  return outputs;
}

AngularGetTextPlugin.prototype.apply = function(compiler) {
  const options = this;

  compiler.plugin('emit', (compilation, done) => {

    if (options.compileTranslations) {
      const results = compile(options.compileTranslations);
      results.forEach( (result) => {
        const { fileName, content } = result;

        var realfileName;

        if (options.compileTranslations.compileCatalog) {
            var language = content[2] + content[3];

            realfileName = fileName.split('.');
            realfileName.splice(1, 0, language);
            realfileName = realfileName.join('.');
        } else {
            realfileName = fileName;
        }

        const outPath = path.join(options.compileTranslations.outputFolder, realfileName);
        
        compilation.assets[outPath] = {
          source: function() {
            return content;
          },
          size: function() {
            return content.length;
          }
        };
      } );
    }

    if (options.extractStrings) {
      var extractor = new Extractor(options.extractStrings);

      const filePaths = glob.sync(options.extractStrings.input)
      filePaths.forEach( (fileName) => {
          var content = fs.readFileSync(fileName, 'utf8');
          extractor.parse(fileName, content);
      });
      fs.writeFileSync(options.extractStrings.destination, extractor.toString())
    }

    done();
  });
};

module.exports = AngularGetTextPlugin;
