var gulp            = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });
});

<% if (sassComplier === 'libsass') { %>
// Gulp default task if Libass selected
gulp.task('scss-libsass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe($.plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe($.sass({
          outputStyle: 'nested',   // Type: String Default: nested Values: nested, compressed
          precision: 3 // Type: Integer Default: 5
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});
<% } %>
<% if (sassComplier === 'compass') { %>
// Gulp default task if compass selected

gulp.task('scss-compass', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe($.plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe($.compass({
      config_file: './config.rb',
      css: 'css',
      sass: 'scss'
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});
<% } %>

// Gulp default task for fonts

gulp.task('fonts', function(){
  return gulp.src('src/fonts/**/*')
    .pipe( gulp.dest('dist/fonts/'));
});


// Gulp default task for javascript

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe( gulp.dest('dist/js/'));
});


// Gulp default task for images

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images/'));
})


<% if(templateOption == 'jade') { %>
gulp.task('jade-templates', function() {
  return gulp.src('src/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe( gulp.dest('dist/') );
});

<% } %>
<% if(templateOption == 'html') { %>
gulp.task('html-templates', function(){
  return gulp.src('src/*.html')
    .pipe($.plumber())
    .pipe( gulp.dest('dist/'));
});
<% } %>

// Gulp default task

gulp.task('default',[
  'browser-sync',
  <% if (sassComplier === 'libsass') { %> 'scss-libsass', <% } %>
  <% if (sassComplier === 'compass') { %> 'scss-compass', <% } %>
  'fonts',
  'js',
  <% if(templateOption == 'jade') { %>
  'jade-templates',
  <% } %><% if(templateOption == 'html'){ %>
  'html-templates'
  <% } %>
  'images'
  ], function () {
  <% if (sassComplier === 'libsass') { %>
  gulp.watch('src/scss/*.scss',['scss-libsass', reload]);
  <% } %>
  <% if (sassComplier === 'compass') { %>
  gulp.watch('src/scss/*.scss',['scss-libsass', reload]);
  <% } %>
  gulp.watch('src/fonts/**/*',['fonts', reload]);

  gulp.watch('src/js/*.js',['js', reload]);

  gulp.watch('src/images/**/*',['images', reload]);

  <% if(templateOption == 'jade') { %>
  gulp.watch('src/*.jade',['jade-templates', reload]);
  <% } %>
  <% if(templateOption == 'html'){ %>
  gulp.watch('src/*.html', ['html-templates', reload]);
  <% } %>
});
