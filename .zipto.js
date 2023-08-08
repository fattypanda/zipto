const {defineConfig} = require('./index');
const dayjs = require("dayjs");

module.exports = defineConfig({
  dateformat: 'YYYY-MM-DD_HH_mm_ss',
  name(options, config) {
    const {name, date} = options;

    const _name = name;
    const _date = date? dayjs().format(date): dayjs().format(config.dateformat);

    return [_name, _date].filter(v => v).join('-');
  },
  output (options, other, config) {
    const {dir} = options;
    const {zip, archive} = other;
    console.log(`
--------- ---------压缩完毕--------- ---------
压缩目录：${dir}
压缩结果：${zip}
生成文件大小 ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB
`);
  }
});
