export const gitData = {
  name: "Git 版本控制",
  description: "Git 常用命令、工作流、分支管理等核心知识",
  icon: "Git",
  items: [
    {
      id: "git-01",
      title: "Git 常用命令速查",
      tags: ["Git", "版本控制", "命令行"],
      excerpt:
        "Git 日常开发中最常用的命令汇总，包括初始化、提交、分支、远程操作等",
      content: `
## 初始化与配置

**初始化仓库**
\`\`\`bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone <repository-url>
\`\`\`

**配置用户信息**
\`\`\`bash
# 全局配置
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 查看配置
git config --list
\`\`\`

## 基本操作

**查看状态**
\`\`\`bash
# 查看工作区状态
git status

# 查看提交历史
git log
git log --oneline  # 简洁模式
git log --graph    # 图形化显示
\`\`\`

**添加文件**
\`\`\`bash
# 添加指定文件
git add filename.js

# 添加所有修改
git add .

# 添加所有修改（包括删除）
git add -A
\`\`\`

**提交更改**
\`\`\`bash
# 提交并添加消息
git commit -m "feat: add new feature"

# 修改最后一次提交
git commit --amend
\`\`\`

## 分支管理

**分支操作**
\`\`\`bash
# 查看所有分支
git branch

# 创建新分支
git branch feature-name

# 切换分支
git checkout feature-name

# 创建并切换分支
git checkout -b feature-name

# 删除分支
git branch -d feature-name      # 安全删除
git branch -D feature-name      # 强制删除
\`\`\`

**合并分支**
\`\`\`bash
# 切换到主分支
git checkout main

# 合并特性分支
git merge feature-name

# 使用 rebase 合并（保持线性历史）
git rebase feature-name
\`\`\`

## 远程操作

**远程仓库**
\`\`\`bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <url>

# 推送到远程
git push origin main

# 拉取远程更新
git pull origin main

# 获取远程更新（不合并）
git fetch origin
\`\`\`

## 撤销操作

**撤销更改**
\`\`\`bash
# 撤销工作区修改
git checkout -- filename

# 取消暂存
git reset HEAD filename

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最近一次提交（丢弃修改）
git reset --hard HEAD~1
\`\`\`

## 标签管理

\`\`\`bash
# 创建标签
git tag v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签到远程
git push origin v1.0.0

# 查看所有标签
git tag
\`\`\`
`,
    },
    {
      id: "git-02",
      title: "Git 工作流最佳实践",
      tags: ["Git", "工作流", "团队协作"],
      excerpt: "Git Flow、GitHub Flow 等常见工作流详解，以及团队协作规范",
      content: `
## Git Flow 工作流

Git Flow 是一种成熟的分支管理策略，适合大型项目。

**主要分支**
- \`main/master\`: 生产环境代码
- \`develop\`: 开发环境代码

**辅助分支**
- \`feature/*\`: 功能开发分支
- \`release/*\`: 发布准备分支
- \`hotfix/*\`: 紧急修复分支

**工作流程**
\`\`\`bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feature/user-login

# 2. 开发完成后合并回 develop
git checkout develop
git merge feature/user-login
git branch -d feature/user-login

# 3. 准备发布
git checkout -b release/1.0.0 develop
# 进行测试和 bug 修复
git checkout main
git merge release/1.0.0
git tag v1.0.0
git checkout develop
git merge release/1.0.0
git branch -d release/1.0.0

# 4. 紧急修复
git checkout -b hotfix/critical-bug main
# 修复 bug
git checkout main
git merge hotfix/critical-bug
git tag v1.0.1
git checkout develop
git merge hotfix/critical-bug
git branch -d hotfix/critical-bug
\`\`\`

## GitHub Flow

更简单的工作流，适合持续部署的项目。

**核心原则**
- main 分支始终可部署
- 所有新功能在分支上开发
- 通过 Pull Request 进行代码审查
- 合并后立即部署

\`\`\`bash
# 1. 从 main 创建分支
git checkout main
git pull
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature

# 3. 创建 Pull Request
# 在 GitHub/GitLab 上创建 PR，等待审查

# 4. 审查通过后合并
# 在平台上点击 Merge
git checkout main
git pull
\`\`\`

## 提交消息规范

遵循 Conventional Commits 规范：

\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
\`\`\`

**常用 type**
- \`feat\`: 新功能
- \`fix\`: 修复 bug
- \`docs\`: 文档更新
- \`style\`: 代码格式（不影响逻辑）
- \`refactor\`: 重构
- \`test\`: 测试相关
- \`chore\`: 构建过程或辅助工具变动

**示例**
\`\`\`bash
git commit -m "feat(auth): add JWT token refresh"
git commit -m "fix(api): handle null response correctly"
git commit -m "docs(readme): update installation guide"
\`\`\`

## .gitignore 最佳实践

\`\`\`gitignore
# 依赖
node_modules/
pnpm-lock.yaml

# 构建输出
dist/
build/
*.log

# 环境变量
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp

# 操作系统
.DS_Store
Thumbs.db
\`\`\`
`,
    },
    {
      id: "git-03",
      title: "Git 高级技巧",
      tags: ["Git", "高级", "技巧"],
      excerpt: "stash、cherry-pick、rebase 等高级命令的使用场景和注意事项",
      content: `
## Stash 暂存

临时保存工作进度，稍后恢复。

\`\`\`bash
# 暂存当前修改
git stash

# 暂存并包含未跟踪文件
git stash -u

# 查看暂存列表
git stash list

# 应用最近的暂存
git stash pop

# 应用指定暂存
git stash apply stash@{1}

# 删除暂存
git stash drop stash@{0}

# 清空所有暂存
git stash clear
\`\`\`

## Cherry-pick 挑选提交

将特定提交应用到当前分支。

\`\`\`bash
# 挑选单个提交
git cherry-pick <commit-hash>

# 挑选多个提交
git cherry-pick <hash1> <hash2>

# 挑选连续范围的提交
git cherry-pick <start-hash>^..<end-hash>

# 发生冲突时
git cherry-pick --continue  # 解决冲突后继续
git cherry-pick --abort     # 放弃操作
\`\`\`

## Rebase 变基

重新排列提交历史，保持线性。

\`\`\`bash
# 交互式变基（整理提交历史）
git rebase -i HEAD~3

# 变基到目标分支
git checkout feature
git rebase main

# 压缩提交
# 在交互式编辑器中将 pick 改为 squash 或 fixup
\`\`\`

**注意事项**
- 不要对已推送到公共仓库的分支进行 rebase
- rebase 会改写历史，可能导致协作问题

## Bisect 二分查找

快速定位引入 bug 的提交。

\`\`\`bash
# 开始二分查找
git bisect start

# 标记当前提交为坏
git bisect bad

# 标记已知的好提交
git bisect good <good-commit-hash>

# Git 会自动检出中间提交，测试后标记
git bisect good  # 或 git bisect bad

# 找到问题提交后结束
git bisect reset
\`\`\`

## Submodule 子模块

管理嵌套的 Git 仓库。

\`\`\`bash
# 添加子模块
git submodule add <repository-url> path/to/submodule

# 初始化子模块
git submodule init
git submodule update

# 克隆包含子模块的仓库
git clone --recursive <repository-url>

# 更新子模块
git submodule update --remote
\`\`\`
`,
    },
    {
      id: "git-04",
      title: "Git 常见问题解决",
      tags: ["Git", "问题", "解决"],
      excerpt: "合并冲突、误删文件、大文件处理等常见问题的解决方案",
      content: `
## 合并冲突解决

**查看冲突文件**
\`\`\`bash
git status
\`\`\`

**手动解决冲突**
冲突标记格式：
\`\`\`
<<<<<<< HEAD
// 当前分支的代码
=======
// 要合并分支的代码
>>>>>>> feature-branch
\`\`\`

**解决步骤**
1. 打开冲突文件，编辑保留需要的代码
2. 删除冲突标记（\`<<<<<<\`、\`======\`、\`>>>>>>\`）
3. 保存文件
4. 标记为已解决
\`\`\`bash
git add resolved-file.js
git commit -m "fix: resolve merge conflict"
\`\`\`

**使用工具解决**
\`\`\`bash
# 使用 mergetool
git mergetool

# 使用 vscode 作为合并工具
git config merge.tool vscode
git config mergetool.vscode.cmd 'code --wait $MERGED'
\`\`\`

## 误删文件恢复

\`\`\`bash
# 恢复工作区删除的文件
git checkout -- deleted-file.js

# 恢复已提交但被删除的文件
git checkout <commit-hash> -- deleted-file.js

# 恢复整个目录
git checkout -- directory/
\`\`\`

## 大文件处理

**移除大文件**
\`\`\`bash
# 从历史记录中移除大文件
git filter-branch --force --index-filter \\
  'git rm --cached --ignore-unmatch large-file.zip' \\
  --prune-empty HEAD~1

# 清理引用
git reflog expire --expire=now --all
git gc --prune=now --aggressive
\`\`\`

**使用 Git LFS**
\`\`\`bash
# 安装 Git LFS
git lfs install

# 跟踪大文件类型
git lfs track "*.psd"
git lfs track "*.mp4"

# 提交 .gitattributes
git add .gitattributes
git commit -m "chore: add git lfs tracking"
\`\`\`

## 重置远程分支

\`\`\`bash
# 强制推送（谨慎使用）
git push --force origin main

# 更安全的强制推送（如果没人基于你的分支工作）
git push --force-with-lease origin main
\`\`\`

## 清理无效引用

\`\`\`bash
# 清理本地无效分支引用
git remote prune origin

# 清理本地已合并的分支
git branch --merged | grep -v '\\*' | xargs -n 1 git branch -d

# 清理所有无效对象
git gc --prune=now
\`\`\`
`,
    },
  ],
};
