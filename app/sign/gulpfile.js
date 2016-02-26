var gulp = require('gulp'),
  spritesmith = require('gulp.spritesmith'),
  minifycss = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  shell = require('gulp-shell'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass')


var dirs = {
  template : 'icon.mustache',
  styles : './src/styles',
  dest : './dist',
  images: {
      dest: './src/images',
      tick_sign_icons : './src/images/tick/sign-icons',
      icons : './src/images/common/sign-icons'
  },
}

var config = {
    'sign' : {
      'src' : [dirs.images.icons + '/*'],
      'imgName' : 'sign-icons.png',
      'cssName' : 'sign-icons.scss',
      'imgDest' : dirs.dest,
      'buildDest': dirs.build,
      'cssDest' : dirs.styles,
      'cssTemplate' : dirs.template,
      'padding' : 0
    },

    'sign2' : {
      'src' : [dirs.images.icons + '@2/*'],
      'imgName' : 'sign-icons@2.png',
      'cssName' : 'sign-icons@2.scss',
      'imgDest' : dirs.dest,
      'buildDest': dirs.build,
      'cssDest' : dirs.styles,
      'cssTemplate' : dirs.template,
      'padding' : 0
    }
}

function sprite(cfg) {
  var sprite = gulp.src(cfg.src)
    .pipe(spritesmith({
      imgName: cfg.imgName,
      cssName: cfg.cssName,
      algorithm: 'binary-tree',
      cssFormat: 'scss',
      cssTemplate: cfg.cssTemplate,
      engine: 'pngsmith',
      padding : cfg.padding
    }))

  sprite.img.pipe(gulp.dest(cfg.imgDest))
  sprite.css.pipe(gulp.dest(cfg.cssDest))
}

gulp.task('styles', function () {
  gulp.src(dirs.styles + '/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    }))
    .pipe(rename({
      basename: 'sign'
    }))
    .pipe(minifycss({ keepSpecialComments : 0 }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dirs.dest))
})

gulp.task('sprite', function () {
    sprite(config.sign)
    sprite(config.sign2)
})

gulp.task('clean', function() {
  del([dirs.dest], {
    force: true
  })
})

gulp.task('build', shell.task([
  'gulp clean',
  'gulp sprite',
  'gulp styles'
]))

gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['sprite','styles'])
})
