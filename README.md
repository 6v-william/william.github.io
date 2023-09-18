# `pc-template`

## 指令

```bash
pnpm i # 安装依赖, 只允许使用pnpm，lock版本

pnpm add xxx # 安装新的依赖
pnpm upgrade [SCRIPT_NAME] # 更新依赖
pnpm remove xxx # 删除依赖

pnpm start # 本地开发
```

## 应用发布

不需要手动发布, 每次 git 提交都会触发流水线进行自动发布

- `master`: 主分支，每次发布后会从prod合并至此，做代码留存
- `prod`: 发布分支, 禁止直接改, 只能从 `pre` 合并. **每次提交会触发正式环境发布流水线，要抓紧配置**
- `pre`: 发布分支, 禁止直接改, 只能从 `daily` 合并. **每次提交会触发预发环境发布流水线，要抓紧配置**
- `daily`: 日常分支, 禁止直接改, 只能从个人的开发分支合并. **每次提交会触发日常环境发布流水线，要抓紧配置**.
- `daily_xxx`: 个人开发分支. 注意需要定期从 `daily` 拉取其他人的代码

每次提交前需要检查:

- 确保代码可以正确执行
- 清理代码执行中产生的 warning 和 error
- 清理 `npm run lint` 中的所有错误提示
- 去掉自己调试用的 `console.log` 打印信息, 不要带到线上
