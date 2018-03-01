/**
 *  Created by BoGao on 2018-01-04;
 */
const fs = require('fs');
const path = require('path');
const debug = require('debug')('aminer:engine');

const replaceFile = (template, target, mapping) => {
  const templateFile = fs.readFileSync(template);
  let out = templateFile.toString();
  out = out.replace('$$ NOTE $$', `!!! This is generated automatically, don't modify !!! `);
  for (const map of mapping) {
    out = out.replace(new RegExp(map.pattern, 'g'), map.to);
  }
  fs.writeFileSync(target, out);
};

const createFile = (target, content) => {
  fs.writeFileSync(target, content);
};

// create link
const copyOrLink = (existingPath, newPath) => {
  //根据文件路径读取文件，返回文件列表
  const files = fs.readdirSync(existingPath);
  files.forEach(function (filename) {
    const filedir = path.join(existingPath, filename);
    const stats = fs.statSync(filedir);
    const isFile = stats.isFile();
    const isDir = stats.isDirectory();
    if (isFile) {
      link(filedir)
    }
    if (isDir) {
      fs.mkdirSync(`${newPath}/${filename}`);
      copyOrLink(filedir, newPath);
    }
  });
};

const mkdir = (newsrc) => {
  fs.mkdirSync(newsrc)
};

const link = (path) => {
  let newPath = '';
  if (path.includes('/src/seedsystems')) {
    newPath = path.replace('seedsystems', 'systems');
  } else if (path.includes('/src/seedthemes')) {
    debug('arguments themeseplace: %o', newPath);
    newPath = path.replace('seedthemes', 'themes');
  } else if (path.includes('/src/seedpages')) {
    newPath = path.replace('seedpages', 'pages');
  }
  fs.linkSync(path, newPath);
};

const rmfile = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        rmfile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// 需要清空的文件夹

// 需要建立连接的文件夹

const clearFolders = (pathArray) => {
  for (let path of pathArray) {
    rmfile(path);
    mkdir(path);
  }
};
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};
const linkPagesByRoutes = (routes) => {
  const files = fs.readdirSync('../src/seedpages');
  if (routes[0] === '*') {
    const files = fs.readdirSync('../src/seedpages');
    copyOrLink(`../src/seedpages`, `../src/pages`);
  } else {
    routes.forEach(function (route) {
      if (route.includes('/')) {
        const newRoute = route.substr(0, route.lastIndexOf('/'));
        const newPath = route.substr(route.lastIndexOf('/') + 1);
        mkdirsSync(`./src/pages/${newRoute}`);
        const files = fs.readdirSync(`./src/seedpages/${newRoute}`);
        files.forEach(function (file) {
          if (file.includes(newPath)) {
            if (file.includes('.')) {
              link(`./src/seedpages/${newRoute}/${file}`)
            } else {
              mkdir(`./src/pages/${newRoute}/${file}`);
              copyOrLink(`./src/seedpages/${newRoute}/${file}`, `./src/pages/${newRoute}/${file}`);
            }
          }
        })
      } else {
        files.forEach(function (file) {
          if (file.includes(route)) {
            if (file.includes('.')) {
              link(`./src/seedpages/${file}`)
            } else {
              mkdir(`./src/pages/${file}`);
              copyOrLink(`./src/seedpages/${file}`, `./src/pages/${file}`);
            }
          }
        })
      }
    })
  }
};


module.exports = { createFile, replaceFile, clearFolders, copyOrLink, linkPagesByRoutes };
