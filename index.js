const fs = require("node:fs");
const path = require("node:path");
const fse = require("fs-extra");
const archiver = require("archiver");
const dayjs = require("dayjs");

/**
 * zipto
 * @param {{dir: string; out: string; name: string; date?: string | false; debug?: boolean;}} options
 * @return {Promise<string>}
 */
const zipto = function (options) {

  const root = path.resolve('.');

  const dir = path.resolve(root, options.dir);
  const out = path.resolve(root, options.out);
  const name = options.name;
  const date = options.date? dayjs().format(options.date): '';
  const debug = !!options.debug;

  const zip = path.resolve(out, [name, date].filter(v => v).join('-') + '.zip');
  const output = fs.createWriteStream(zip);

  fse.ensureDir(out);

  return new Promise((resolve) => {
    const archive = archiver("zip", {
      zlib: { level: 9 }, // 设置压缩级别
    });

    archive.on("error", function (err) {
      throw err;
    });

    output.on("close", function () {
      if (debug) {
        console.log(`
--------- ---------压缩完毕--------- ---------
压缩目录：${dir}
压缩结果：${zip}
生成文件大小 ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB
`);
      }
      resolve(zip);
    });

    archive.pipe(output);

    archive.directory(dir, '/');

    archive.finalize().then(() => {});
  });
}

exports = module.exports = zipto;
