#!/usr/bin/env node

/* eslint-disable no-process-exit */

const { program } = require('commander');
const zipto = require('./index');

program
  .name('zipto')
  .requiredOption('-d,--dir <dir>', '压缩选择的应用目录')
  .option('-o,--out <dir>', '压缩后输出目录', 'zips')
  .option('-n,--name <name>', '压缩后文件名')
  .option('--date <dateformat>', '文件名携带时间', true)
  .option('--no-date', '禁用文件名携带时间', false)
  .option('--debug', '开启 debug 模式', true)
  .option('--no-debug', '关闭 debug 模式', false)

program.parse(process.argv);

zipto(program.opts()).then(() => {});
