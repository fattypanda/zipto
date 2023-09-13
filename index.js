const fs = require("node:fs");
const path = require("node:path");
const fse = require("fs-extra");
const archiver = require("archiver");

/**
 * zipto
 * @param {import("./zipto").ZipToOptions} options
 * @return {Promise<string>}
 */
const zipto = function (options) {

  /**
   * @type {Partial<import("./zipto").ZipToDefineConfig>}
   */
  let _config = {};
  try {
    _config = require(path.resolve('.', './.zipto.js'));
  } catch (e) {}

  /**
   * @type {import("./zipto").ZipToDefineConfig}
   */
  const _defaultConfig = require('./.zipto.js');

  /**
   * @type {import("./zipto").ZipToDefineConfig}
   */
  const config = {..._defaultConfig, ..._config};

  const root = path.resolve('.');

  const dir = path.resolve(root, options.dir);
  const out = path.resolve(root, options.out);
  const debug = !!options.debug;

  const names = [config.name(options, config)];

  if (options.date) {
    if (typeof options.date === "string") config.dateformat = options.date;
    if (config.date) names.push(config.date(options, config));
  }

  const zip = path.resolve(out, names.join(config.join) + '.zip');
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
      if (debug) config.output(options, {zip, archive}, config);
      resolve(zip);
    });

    archive.pipe(output);

    archive.directory(dir, '/');

    archive.finalize().then(() => {});
  });
}

module.exports = zipto;

/**
 *
 * @param {Partial<import("./zipto").ZipToDefineConfig>} options
 */
const defineConfig = (options) => options;

module.exports.defineConfig = defineConfig;
