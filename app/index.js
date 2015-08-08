'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var mkdirp = require('mkdirp');
var yosay = require('yosay');
var semver = require('semver');
var self;

var psdTohtml = yeoman.generators.Base.extend({
  init: function () {
    self = this;
    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay('Automate process of converting psd to html'));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What\'s project name?',
      default: path.basename(process.cwd()),
      filter: function (value) {
        return self._.camelize(self._.slugify(self._.humanize(value)));
      }
    }, {
      type: 'input',
      name: 'projectVersion',
      message: 'What\'s project version?',
      default: '0.0.1',
      validate: function (value) {
        if (value == semver.valid(value)) {
          return true;
        } else {
          return "Please use a semantic version number (http://semver.org/)"
        }
      }
    }, {
      type: 'input',
      name: 'projectAuthor',
      message: 'What\'s author name ?'
    }, {
      type: 'input',
      name: 'projectDescription',
      message: 'Describe your project.'
    }, {
      type: 'list',
      name: 'cssFramework',
      message: 'Choose your prefered css Framework',
      choices: [
        { name: 'Foundation Zurb', value: 'foundation'},
        { name: 'Bootstrap', value: 'bootstrap'},
        { name: 'No framework', value: 'none'}
      ]
    }, {
      type: 'confirm',
      name: 'bowerOption',
      message: 'Would you like to include Bower for dependency management?',
      default: true
    }, {
      type: 'list',
      name: 'styleOption',
      message: 'What css preprocessor do you want to use?',
      choices: [
        { name: 'Sass', value: 'sass' },
        { name: 'SCSS', value: 'scss' }
      ]
    }, {
      type: 'list', 
      name: 'sassComplier',
      message: 'Which sass complier would you like to use',
      choices: [
        { name: 'Libsass', value:'libsass'},
        { name:'Compass', value:'compass'}
      ]
    }, {
      type: 'list',
      name: 'templateOption',
      message: 'What would you like to use for templating?',
      choices: [
        { name: 'Pure HTML', value: 'html' },
        { name: 'Jade', value: 'jade' }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.projectName = this._.str.camelize(props.projectName, true);
      this.projectVersion = props.projectVersion;
      this.projectAuthor = props.projectAuthor;
      this.projectDescription = props.projectDescription;
      this.bowerOption = props.bowerOption;
      this.templateOption = props.templateOption;
      this.styleOption = props.styleOption;
      this.sassComplier = props.sassComplier;
      this.cssFramework = props.cssFramework;

      done();
    }.bind(this));
  },

  app: function () {
  	// Add src folder
    mkdirp('src');

    // Add js folder to src
    mkdirp('src/js');

  	// Add javascript files to src/js
    this.template('_main.js', 'src/js/main.js');

    // Add index.jade or index.html
    this.template('_index.'+this.templateOption, 'src/index.'+this.templateOption);

    // Copy gulpfile to app directory
    this.copy('_gulpfile.js', 'gulpfile.js');

    // Add images folder to src
    mkdirp('src/images');

    // Add fonts folder to src
    mkdirp('src/fonts');

    if(this.styleOption){
      // Add scss folder to src
      mkdirp('src/'+this.styleOption);

      this.template('_main.'+this.styleOption, 'src/'+this.styleOption+'/main.'+this.styleOption);
    }

    this.template('_package.json', 'package.json');

    if(this.bowerOption) {
      this.copy('_bower.json', 'bower.json');
      this.copy('_bowerrc', '.bowerrc');
    }
    // Add .gitignore to the project
    this.copy('gitignore', '.gitignore');

    // Add README.md file
    this.copy('_README.md', 'README.md');

  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
  },

  end: function () {
    this.installDependencies({
      bower: this.bowerOption,
      skipInstall: this.options['skip-install']
    });
  }
});


module.exports = psdTohtml;