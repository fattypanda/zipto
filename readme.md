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

```ecmascript 6
const zipto = require('zipto')

zipto({
  dir: 'app',
  out: 'dist',
  name: 'app'
});
```

### Options

- `dir` (required) - 需要压缩的目录
- `name` - 压缩后文件名称；默认值：与 `dir` 同值
- `out` - 压缩后输出目录; 默认值：`dist`
- `date` - 压缩后文件名称时间；
- `debug` - 开启 debug 模式；默认值：`true`
- `gitInfo` - 开启 Git 描述信息记录；默认值：`true`

## CLI Usage

```shell
zipto -d <zip-dir> -n <zip-name> -o <zip-out>
```

- `-d,--dir <dir>` (required) - 需要压缩的目录
- `-n,--name <name>` - 压缩后文件名称；默认值：与 `dir` 同值
- `-o,--out <dir>` - 压缩后输出目录; 默认值：`dist`
- `--date <format>` - 压缩后文件名称时间；
- `--no-date` - 禁用时间处理；
- `--git-info` - 开启 Git 描述信息记录；默认值：`true`
- `--debug` - 开启 debug 模式；默认值：`true`
- `--no-debug` - 关闭 debug 模式；默认值：`false`
- `-h,--help` - 展示 help 信息


## Config

/.zipto.js

```ecmascript 6
const {defineConfig} = require('./index');
const dayjs = require("dayjs");
const path = require("node:path");
const fse = require("fs-extra");
const simpleGit = require("simple-git");

async function getVersionInfo() {
	try {
		const git = simpleGit();
		
		// 当前提交哈希值
		const hash = await git.revparse(['HEAD']);
		
		// 当前分支名
		const branch = (await git.branch()).current;
		
		// 获取远程地址
		const remotes = await git.getRemotes(true);
		const remoteUrls = remotes.map(remote => remote.refs.fetch);
		
		// 最后一次提交信息
		const log = await git.log({ n: 1 });
		const lastCommit = log.latest;
		
		// Git 描述信息（最近的 tag 或简要版本信息）
		const description = await git.raw(['describe', '--tags', '--always', '--dirty']);
		
		return {
			hash,
			branch,
			remotes: remoteUrls,
			lastCommit: {
				message: lastCommit.message,
				author: lastCommit.author_name,
				date: lastCommit.date,
			},
			description: description.trim(),
		};
	} catch (error) {
		console.error('Error getting version info:', error.message);
		return null;
	}
}

module.exports = defineConfig({
	dateformat: 'YYYY-MM-DD_HH_mm_ss',
	join: '-',
	name(options, config) {
		return options.name? options.name: options.dir;
	},
	date (options, config) {
		return dayjs().format(config.dateformat);
	},
	async gitInfo (options, config) {
		const pathname = path.resolve('.', options.dir, 'gitInfo.json');
		return getVersionInfo().then((content) => {
			fse.outputFileSync(pathname, JSON.stringify(content));
		});
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

```

## Update

#### 2.0.0
- 添加 `gitInfo` 的记录，并可以配置是否使用，默认使用；

#### 1.3.2
- 移除 `npm` 仓库的打包测试文件；
- 
#### 1.3.1
- 修复 `.zipto.js` 中的 `date` 配置默认不生效的BUG；

#### 1.3.0
- 取消 name 的必填要求（默认与 dir 同值）
- 添加 `--no-date` 可禁用时间处理函数
- `.zipto.js` 可分别定制 `name` 和 `date` 函数
