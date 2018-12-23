<h2 align="center">gulp-sass-bootstrap-boilerplate</h2>

<p align="center">
  <a href="https://github.com/abhijithvijayan/gulp-sass-boilerplate/blob/master/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/abhijithvijayan/gulp-sass-boilerplate.svg"></a>
  <a href="https://www.npmjs.com/package/gulp">
    <img alt="gulp" src="https://img.shields.io/badge/gulp-v4.0.0-blue.svg"></a>
  <a href="http://getbootstrap.com/">
    <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-v4.2.1-563d7c.svg"></a>
  <a href="https://www.npmjs.com/package/gulp-sass">
    <img alt="gulp-sass" src="https://img.shields.io/badge/gulp--sass-4.0.2-ff69b4.svg"></a>
  <a href="#">
    <img alt="livereload" src="https://img.shields.io/badge/dev--server-live--reloading-red.svg"></a>
</p>

<p align="center">
  <em>
  SASS
  · Babel
  · Bootstrap
  · Gulp
  · Live Reload
  </em>
</p>

### in the _Beta_ Version :)

This Gulp-Sass boilerplate starter contains the features and scripts you need to get started quickly with Gulp Runner and building, Live Loading.

It contains the following features:

- Gulp Runner
- Babel ES7 Compiler
- SASS Compiler
- Bootstrap v4
- Browser-Sync Live-Reloading
- JS & CSS Compression
- SourceMapping

## Features

### Gulp Loaders and Plugins

This project contains the following loaders & plugins:

- Gulp-Sass for compiling sass (SCSS)
- Babel Loader for compiling ES7 code
- Gulp-Uglify for compressing JS
- Gulp-Clean-CSS for compressing CSS
- Gulp-Sourcemaps for mapping into css file
- Gulp-rev for filename hashing

## Getting Started

### Requirements

- Make sure you have [NodeJS](https://nodejs.org/en/) installed, as this contains [npm](https://www.npmjs.com/), which installs dependencies for the project.

### Quick Start

Clone the repo:

```
git clone https://github.com/abhijithvijayan/gulp-sass-boilerplate.git
```

Navigate to the project folder

```
cd gulp-sass-boilerplate
```

Install all packages and dependencies:

```
npm install
```

Launch the development environment with:

```
gulp
```

then, navigate to http://localhost:3000

Building files can be done as follows:

```
gulp build
```

## How To Use

- Add your HTML files by inserting or including them in the `app` directory
  - (By default `index.html` is added to the directory, edit it with the changes seen live.)

- Add `images` to your `app/assets` folder.

- Add `sass`(SCSS) files to `app/sass` folder.

    - Make sure you import the scss file in `main.scss`
      ```
      @import "filename";
      ```

## TODO list

- [x] Bootstrap inclusion
- [ ] Jquery
- [ ] PopperJS
- [ ] CSS Loaders
- [ ] Assets Loader
- [ ] Zip Plugin
- [ ] Code Optimising

## Licence

Code released under the [MIT License](https://github.com/abhijithvijayan/gulp-sass-boilerplate/blob/master/LICENCE).
