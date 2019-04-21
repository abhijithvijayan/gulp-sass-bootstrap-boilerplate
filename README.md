<h2 align="center">gulp-sass-bootstrap-boilerplate</h2>

<p align="center">
  <a href="https://travis-ci.org/abhijithvijayan/gulp-sass-bootstrap-boilerplate">
    <img alt="travis" src="https://travis-ci.org/abhijithvijayan/gulp-sass-bootstrap-boilerplate.svg?branch=master"></a>
  <a href="https://www.npmjs.com/package/gulp">
    <img alt="gulp" src="https://img.shields.io/badge/gulp-v4.0.0-blue.svg"></a>
  <a href="http://getbootstrap.com/">
    <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-v4.2.1-563d7c.svg"></a>
  <a href="https://www.npmjs.com/package/gulp-sass">
    <img alt="node-sass" src="https://img.shields.io/badge/node--sass-v4.11.0-ff69b4.svg"></a>
  <a href="https://jquery.com/">
    <img alt="jQuery" src="https://img.shields.io/badge/jquery-v3.3.1-ffa200.svg"></a>
  <a href="#">
    <img alt="livereload" src="https://img.shields.io/badge/dev--server-live--reloading-red.svg"></a>
</p>

<p align="center">
  <em>
  SASS
  · Babel
  · Bootstrap
  · Gulp
  · JQuery
  · PopperJS
  · Browsersync
  </em>
</p>

![bootstrap logo](https://user-images.githubusercontent.com/10498583/31125543-e2a88c2c-a848-11e7-87b0-d20ea38d41d0.jpg)
![babel logo](https://i.imgur.com/ggqfSuw.png)
![sass logo](https://user-images.githubusercontent.com/10498583/31125541-e2a732e6-a848-11e7-959d-7d7b0c138124.jpg)
![gulp logo](https://user-images.githubusercontent.com/10498583/31125542-e2a78b88-a848-11e7-8ac5-c396f46e811f.jpg)
![browsersync logo](https://user-images.githubusercontent.com/10498583/31125540-e2a6eed0-a848-11e7-817a-69c5619f772a.jpg)

This Gulp-Sass boilerplate starter contains the features and scripts you need to get started quickly with Gulp Runner and building, Live Loading.

It contains the following features:

- GulpJS
- Babel ES6 Compiler
- Bootstrap v4
- JQuery v3.3.1
- PopperJS
- Concatenate and minify JavaScript.
- Compile, minify, autoprefix SASS.
- Browser-Sync Hot-Reloading
- Optimize and Cache Images

## Features

### Gulp Loaders and Plugins

This project contains the following loaders & plugins:

- `node-sass` for compiling sass (SCSS)
- `gulp-babel` for compiling ES6 code
- `Browser-sync` for hot-reloading
- `gulp-uglify` for compressing JS
- `gulp-clean-css` for compressing CSS
- `gulp-sourcemaps` for mapping into css file
- `gulp-rev` for filename hashing
- `gulp-imagemin` for optimising images

<hr />

## Getting Started

### Dependencies

*__Note:__ if you've previously installed Gulp globally, run `npm rm --global gulp` to remove it. [Details here.](https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467)*

Make sure these are installed first.

- [Node.js](http://nodejs.org)
- [Gulp Command Line Utility](http://gulpjs.com)

     `npm install --global gulp-cli`

### Quick Start

1. Clone the repo :
    
      `git clone https://github.com/abhijithvijayan/gulp-sass-boilerplate.git
     `
2. In bash/terminal/command line, `cd gulp-sass-boilerplate` into project directory.
3. Run `npm install` to install required files and dependencies.
4. Launch the `development environment` with :

    `
    gulp
    `

    then, navigate to http://localhost:3000

Note: **For Production, Use:**

```
gulp build
```
This will build files and assets to `dist` directory.

<hr />

## Documentation

### Workflow structure

`src` - > source directory

`dist` -> build directory


```
.
├── src
│   ├── assets
│   │   └── 500x300.jpg
│   ├── sass
│   │   ├── _fonts.scss
│   │   ├── _variables.scss
│   │   └── main.scss
│   ├── index.js
│   └── index.html
.
.
├── dist
│   ├── assets
│   │   ├── 500x300.jpg
│   │   └── rev-manifest.json
│   ├── css
│   │   └── style.min.css
│   ├── js
│   │   └── bundle.min.js
│   └── index.html
.
```

### Instructions

- Add your HTML files by inserting or including them in the `src` directory (By default `index.html` is added to the directory, feel free to edit it with the changes seen live.)
  - For the new `HTML` file(s), link the `styles.css` (in head tag) and `bundle.js` (in body tag) file in the `HTML` files as they are created.
      ```
      <head>
          :
          <link rel="stylesheet" href="css/style.css" />
      </head>
      <body>
          : 
          <script src="js/bundle.js"></script>
      </body>
      ```

- Add `sass`(SCSS) files to `src/sass` folder.

    - Make sure you import the scss file in `main.scss`
      ```
      @import "filename";
      ```

- Add `images` to `src/assets` folder.


## Licence

Code released under the [MIT License](https://github.com/abhijithvijayan/gulp-sass-boilerplate/blob/master/LICENCE).
