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
