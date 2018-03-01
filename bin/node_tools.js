/**
 *  Created by BoGao on 2018-01-04;
 *  TODO @xiaobei: 一个 linkFolder 方法，完全按照 ln 的参数执行硬链接操作。现在的版本太不general了，不是一个工具。
 *  TODO @xiaobei: 系统启动时需要将systems和themes下面所有的系统的文件夹删除。
 *  TODO @xiaobei: 在生成硬链接的目录中添加警告声明。
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

// create link
const copyOrLink = (existingPath, newPath) => {
  //根据文件路径读取文件，返回文件列表
  const files = fs.readdirSync(existingPath);
  files.forEach(function (filename) {
    if (filename === '.DS_Store') {
      return
    }
    // console.log('>> process file:', filename);
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
  const newPath = path.replace(/src\/seedsystems/g, 'src/systems')
    .replace(/src\/seedthemes/g, 'src/themes')
    .replace('src/seedpages', 'src/pages');
  // const newPath = path.replace(/src\/seedsystems\/[0-9a-zA-Z_-]+\//g, 'src/systems/current/')
  //   .replace(/src\/seedthemes\/[0-9a-zA-Z_-]+\//g, 'src/themes/current/')
  //   .replace('src/seedpages', 'src/pages');
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


const linkPagesByRoutes = (routes) => {
  const files = fs.readdirSync('src/seedpages');
  if (routes[0] === '*') {
    const files = fs.readdirSync('src/seedpages');
    linkFolder(`src/seedpages`, `src/pages`);
  } else {
    routes.forEach(function (route) {
      if (route.includes('/')) {
        const newRoute = route.substr(0, route.lastIndexOf('/'));
        const newPath = route.substr(route.lastIndexOf('/') + 1);
        mkdirsSync(`src/pages/${newRoute}`);
        const files = fs.readdirSync(`src/seedpages/${newRoute}`);
        files.forEach(function (file) {
          if (file.includes(newPath)) {
            if (file.includes('.')) {
              link(`src/seedpages/${newRoute}/${file}`)
            } else {
              mkdir(`src/pages/${newRoute}/${file}`);
              copyOrLink(`src/seedpages/${newRoute}/${file}`, `src/pages/${newRoute}/${file}`);
            }
          }
        })
      } else {
        files.forEach(function (file) {
          if (file.includes(route)) {
            if (file.includes('.')) {
              link(`src/seedpages/${file}`)
            } else {
              mkdir(`src/pages/${file}`);
              copyOrLink(`src/seedpages/${file}`, `src/pages/${file}`);
            }
          }
        })
      }
    })
  }
};


// ============================


// link folder into dest
// if is file, link file under dest folder.
// if is folder, link all things under this folder into dest folder recusively.
const linkFolder = (from, dest) => {
  // console.log("move folder from %s to %s", from, dest);

  // 递归
  const linkit = (folder, file) => {
    const filePath = path.join(folder, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const from2 = from.replace(/^.\//, '');
      // console.log(" >> replace:", filePath, from2, dest);
      const destPath = path.dirname(filePath.replace(from2, dest));
      // console.log("  -  ", filePath);
      // console.log("  =  ", destPath);
      mkdirsSync(destPath);
      fs.linkSync(filePath, path.join(destPath, file));
    } else if (stats.isDirectory()) {
      // console.log(" [+] ", filePath)
      const files = fs.readdirSync(filePath);
      files.forEach(function (filename) {
        if (filename === '.DS_Store') {
          return
        }
        linkit(filePath, filename);
      });
    } else {
      console.log(" >> meet strange file: ", filePath, stats)
    }
  }

  // start
  const stats = fs.statSync(from);
  if (stats.isDirectory()) {
    linkit(path.dirname(from), path.basename(from))
  } else if (stats.isFile()) {
    // link file into dest dir.
    mkdirsSync(dest)
    fs.linkSync(from, path.join(dest, path.basename(from)));
  }
};


module.exports = {
  createFile,
  replaceFile,
  clearFolders,
  copyOrLink,
  linkPagesByRoutes,
  linkFolder
};
