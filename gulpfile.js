var gulp = require('gulp'),
    shell = require('gulp-shell'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    packager = require('electron-packager'),
    builder = require('electron-builder'),
    argv = require('yargs').argv
