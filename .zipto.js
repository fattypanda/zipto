const {defineConfig} = require('./index');
const dayjs = require("dayjs");
const path = require("node:path");

module.exports = defineConfig({
  dateformat: 'YYYY-MM-DD_HH_mm_ss',
  join: '-',
  name(options, config) {
    return options.name? options.name: options.dir;
  },
  date (options, config) {
    return dayjs().format(config.dateformat);
  },
  output (options, other, config) {
    const {dir} = options;
    const {zip, archive} = other;
    console.log(`
--------- ---------压缩完毕--------- ---------
压缩目录：${path.resolve('.', dir)}
压缩结果：${zip}
生成文件大小 ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB
`);
  }
});
