import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import https from "https";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

const repositoryInfo = {
  owner: packageJson.repository.owner,
  repo: packageJson.repository.repo
};

/**
 * @typedef {Object} GenerateReleaseContentOptions
 * @property {string} [filePath] 文件路径
 */

/**
 * 生成发布内容
 * 指定文件路径，生成发布内容
 */

program
  .version("1.0.0")
  .description("生成发布内容")
  .option("-f, --filePath <filePath>", "文件路径")
  .action(() => {
    generateReleaseContent(program.opts());
  })
  .parse(process.argv);

/**
 * @param {GenerateReleaseContentOptions} options
 * @returns
 */
async function generateReleaseContent(options) {
  const latestReleaseVersionCommitish = await getLatestReleaseVersionCommitish();
  if (!latestReleaseVersionCommitish) {
    console.error("无法获取最新发布版本的提交信息");
    return "";
  }

  try {
    // 获取从 latestReleaseVersionCommitish 到当前 HEAD 的非合并提交记录
    const commits = getNonMergeCommits(latestReleaseVersionCommitish);

    if (commits.length === 0) {
      console.log("没有新的提交记录");
      return "";
    }

    // 格式化发布内容
    const releaseContent = formatReleaseContent(commits);

    // 如果指定了文件路径，写入文件
    if (options.filePath) {
      const filePath = path.resolve(options.filePath);
      fs.writeFileSync(filePath, releaseContent, "utf-8");
      console.log(`发布内容已写入: ${filePath}`);
    } else {
      // 否则输出到控制台
      console.log(releaseContent);
    }

    return releaseContent;
  } catch (error) {
    console.error("生成发布内容时出错:", error instanceof Error ? error.message : String(error));
    return "";
  }
}

async function getLatestReleaseVersionCommitish() {
  try {
    /** @type {{target_commitish: string} | {message?: string, status?: number}} */
    const latestReleaseVersion = await new Promise((resolve, reject) => {
      https
        .get(
          `https://api.github.com/repos/${repositoryInfo.owner}/${repositoryInfo.repo}/releases/latest`,
          {
            headers: {
              "User-Agent": "nodejs"
            }
          },
          res => {
            /** @type {Buffer[]} */
            let data = [];
            res.on("data", chunk => {
              data.push(chunk);
            });
            res.on("end", () => {
              const responseText = Buffer.concat(data).toString();
              try {
                const parsed = JSON.parse(responseText);
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                  resolve(parsed);
                } else {
                  resolve({ status: res.statusCode || 0, message: parsed.message || responseText });
                }
              } catch (parseError) {
                reject(new Error(`解析响应失败: ${responseText}`));
              }
            });
            res.on("error", err => {
              reject(err);
            });
          }
        )
        .on("error", err => {
          reject(err);
        });
    });

    if ("status" in latestReleaseVersion || !("target_commitish" in latestReleaseVersion)) {
      return "";
    }

    return latestReleaseVersion.target_commitish;
  } catch (error) {
    console.error("获取最新发布版本时出错:", error instanceof Error ? error.message : String(error));
    return "";
  }
}

/**
 * 获取从指定提交到当前 HEAD 的非合并提交记录
 * @param {string} fromCommitish 起始提交
 * @returns {Array<{hash: string, author: string, date: string, message: string}>}
 */
function getNonMergeCommits(fromCommitish) {
  try {
    const repoRoot = path.join(__dirname, "..");
    // 使用 git log 获取提交记录，排除合并提交
    // --no-merges: 排除合并提交
    // --pretty=format: 自定义输出格式，使用特殊分隔符
    const gitLogCommand = `git log ${fromCommitish}..HEAD --no-merges --pretty=format:"%h|%an|%ad|%s" --date=short`;

    const output = execSync(gitLogCommand, {
      cwd: repoRoot,
      encoding: "utf-8"
    });

    if (!output || !output.trim()) {
      return [];
    }

    // 解析提交记录
    const commits = output
      .trim()
      .split("\n")
      .filter(line => line.trim())
      .map(line => {
        const [hash, author, date, ...messageParts] = line.split("|");
        return {
          hash: hash || "",
          author: author || "",
          date: date || "",
          message: messageParts.join("|") || ""
        };
      });

    return commits;
  } catch (error) {
    console.error("获取 git 提交记录时出错:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * 格式化发布内容
 * @param {Array<{hash: string, author: string, date: string, message: string}>} commits
 * @returns {string}
 */
function formatReleaseContent(commits) {
  const lines = ["## 更新内容\n"];

  commits.forEach(commit => {
    lines.push(`- ${commit.message} (${commit.hash})`);
  });

  lines.push("\n---\n");
  lines.push(`**提交数量**: ${commits.length}\n`);
  lines.push(`**时间范围**: ${commits[commits.length - 1]?.date || ""} ~ ${commits[0]?.date || ""}\n`);

  return lines.join("\n");
}
