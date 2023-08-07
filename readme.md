# zipto

`zipto`是用纯JavaScript编写的。可将目录压缩到对应位置的zip中。可用作库或命令行程序。

[![NPM](https://nodei.co/npm/zipto.png?global=true)](https://npm.im/zipto)

## 安装

请确保已安装Node 10或更高版本。

```shell
npm install zipto --save
```

安装命令行程序:

```shell
npm install zipto -g
```

## JS API

```javascript
const zipto = require('zipto')

zipto({
  dir: 'app',
  out: 'dist',
  name: 'app'
});
```

### Options

- `dir` (required) - 需要压缩的目录
- `name` (required) - 压缩后文件名称
- `out` - 压缩后输出目录; 默认值：`dist`
- `date` - 压缩后文件名称时间；默认值：`YYYY-MM-DD_HH_mm_ss_SSS`
- `debug` - 开启 debug 模式；默认值：`true`

## CLI Usage

```shell
zipto -d <zip-dir> -n <zip-name> -o <zip-out>
```

- `-d,--dir <dir>` (required) - 需要压缩的目录
- `-n,--name <name>` (required) - 压缩后文件名称
- `-o,--out <dir>` - 压缩后输出目录; 默认值：`dist`
- `--date <format>` - 压缩后文件名称时间；默认值：`YYYY-MM-DD_HH_mm_ss_SSS`
- `--debug` - 开启 debug 模式；默认值：`true`
- `--no-debug` - 关闭 debug 模式；默认值：`false`
- `-h,--help` - 展示 help 信息
