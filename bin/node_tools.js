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
const fileDisplay = (filePath) => {
  //根据文件路径读取文件，返回文件列表
  const files = fs.readdirSync(filePath);
  files.forEach(function (filename) {
    const filedir = path.join(filePath, filename);
    const stats = fs.statSync(filedir);
    const isFile = stats.isFile();
    const isDir = stats.isDirectory();
    if (isFile) {
      link(filedir)
    }
    if (isDir) {
      mkdir(filedir);
      fileDisplay(filedir);
    }
  });
};

const mkdir = (newsrc) => {
  // const newsrc = src.replace('systemseed', 'systems');
  debug('arguments is : %o', newsrc);
  fs.mkdirSync(newsrc)
};

const link = (path) => {
  // const src = path.replace('systemseed', 'systems');
  fs.linkSync(path, src)
};

const rmfile = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        rmfile(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// 需要清空的文件夹

// 需要建立连接的文件夹
const linkFileGroup = ['./src/seedpages/', './src/seedsystems/xxx'];

const init = (system) => {
  // clear all linked content.
  for (let path of clearPathGroup) {
    rmfile(path);
    mkdir(path);
  }

  const root = (`./src/seedsystems/${system}`);
  const filePath = path.resolve(root);
  debug('arguments is ddddd: %o', filePath);
  // rmfile('../src/aa')
  // mkdir(root);
  // fileDisplay(filePath);
};

module.exports = { createFile, replaceFile, init };
