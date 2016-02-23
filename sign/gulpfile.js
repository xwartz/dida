var gulp = require('gulp'),
  spritesmith = require('gulp.spritesmith'),
  minifycss = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  shell = require('gulp-shell'),
  del = require('del'),
  path = require('path'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  md5 = require('gulp-md5');


var dirs = {
  deploy : './deploy/sign',
  build : './build/sign',
  template : 'icon.mustache',
  scripts : './src/scripts',
  styles : './src/styles',
  dest : './dist',
  images: {
      dest: './src/images',
      dida_sign_icons : './src/images/dida/sign-icons',
      tick_sign_icons : './src/images/tick/sign-icons',
      common_icons : './src/images/common/sign-icons'
  },
}

var dida_sprite = {
    "sign" : {
      "src" : [dirs.images.dida_sign_icons + '/*', dirs.images.common_icons + '/*'],
      "imgName" : "sign-icons.png",
      "cssName" : "sign-icons.scss",
      "imgDest" : dirs.deploy,
      "buildDest": dirs.build,
      "cssDest" : dirs.styles,
      "cssTemplate" : dirs.template,
      "padding" : 0
    },

    "sign2" : {
      "src" : [dirs.images.dida_sign_icons + '@2/*', dirs.images.common_icons + '@2/*'],
      "imgName" : "sign-icons@2.png",
      "cssName" : "sign-icons@2.scss",
      "imgDest" : dirs.deploy,
      "buildDest": dirs.build,
      "cssDest" : dirs.styles,
      "cssTemplate" : dirs.template,
      "padding" : 0
    }
}

var tick_sprite = {
    "sign" : {
      "src" : [dirs.images.tick_sign_icons + '/*', dirs.images.common_icons + '/*'],
      "imgName" : "sign-icons.png",
      "cssName" : "sign-icons.scss",
      "imgDest" : dirs.deploy,
      "buildDest": dirs.build,
      "cssDest" : dirs.styles,
      "cssTemplate" : dirs.template,
      "padding" : 0
    },

    "sign2" : {
      "src" : [dirs.images.tick_sign_icons + '@2/*', dirs.images.common_icons + '@2/*'],
      "imgName" : "sign-icons@2.png",
      "cssName" : "sign-icons@2.scss",
      "imgDest" : dirs.deploy,
      "buildDest": dirs.build,
      "cssDest" : dirs.styles,
      "cssTemplate" : dirs.template,
      "padding" : 0
    }
}

function sprite(cfg) {
  var sprite = gulp.src(cfg.src)
    .pipe(spritesmith({
      imgName: cfg.imgName,
      cssName: cfg.cssName,
      algorithm: "binary-tree",
      cssFormat: "scss",
      cssTemplate: cfg.cssTemplate,
      engine: "pngsmith",
      padding : cfg.padding
    }));

  sprite.img.pipe(gulp.dest(cfg.imgDest))
      .pipe(md5())
      .pipe(rename(function(p) {
        p.basename = p.basename.replace(/\_/, '.')
      }))
      .pipe(gulp.dest(cfg.buildDest));

  sprite.css.pipe(gulp.dest(cfg.cssDest));
}

gulp.task('sprite', function() {
  sprite_scss(config.app);
  sprite_scss(config.app2);
});

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
    .pipe(gulp.dest(dirs.dest))
    .pipe(minifycss({keepSpecialComments : 0}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dirs.deploy))
    .pipe(md5())
    .pipe(rename(function(path) {
        path.basename = path.basename.replace(/\_/, '.');
    }))
    .pipe(gulp.dest(dirs.build));
})

gulp.task('scripts', function () {
  gulp.src([dirs.scripts + '/jquery.js', dirs.scripts + '/sign.js', dirs.scripts + '/analytics.js'])
    .pipe(concat('sign.js'))
    .pipe(uglify())
    .pipe(rename({
      basename: 'sign',
      suffix: '.min'
    }))
    .pipe(gulp.dest(dirs.deploy))
    .pipe(md5())
    .pipe(rename(function(path) {
        path.basename = path.basename.replace(/\_/, '.');
    }))
    .pipe(gulp.dest(dirs.build))
})

gulp.task('sprite:dida', function () {
    sprite(dida_sprite.sign)
    sprite(dida_sprite.sign2)
})

gulp.task('sprite:tick', function () {
    sprite(tick_sprite.sign)
    sprite(tick_sprite.sign2)
})

gulp.task('clean', function() {
  del([dirs.dest, dirs.deploy, dirs.build], {force: true});
});

gulp.task('deploy:dida', shell.task([
    'gulp sprite:dida',
    'gulp styles',
    'gulp scripts'
]));

gulp.task('deploy:tick', shell.task([
    'gulp sprite:tick',
    'gulp styles',
    'gulp scripts'
]));


gulp.task('build:sign:dida', shell.task([
  'gulp clean',
  'gulp deploy:dida'
]));

gulp.task('build:sign:tick', shell.task([
  'gulp clean',
  'gulp deploy:tick'
]));

// 只 watch 了滴答
gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['sprite:dida','styles']);
})
