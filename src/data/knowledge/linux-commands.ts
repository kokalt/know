import type { KnowledgeData } from "../../pages/KnowledgeDetail";

export const linuxCommandsData: KnowledgeData = {
  name: "Linux 常用命令",
  description: "Linux 系统管理、文件操作、进程管理等常用命令",
  icon: "LX",
  items: [
    {
      id: "lx-01",
      title: "文件与目录操作",
      tags: ["Linux", "文件", "目录"],
      excerpt: "文件和目录的基本操作命令",
      content: `## 目录导航

\`\`\`bash
# 显示当前目录
pwd

# 切换目录
cd /path/to/directory
cd ..           # 返回上级目录
cd ~            # 返回家目录
cd -            # 返回上一个目录

# 列出目录内容
ls
ls -l           # 详细列表
ls -la          # 包含隐藏文件
ls -lh          # 人类可读的文件大小
ls -R           # 递归列出子目录
\`\`\`

## 文件操作

\`\`\`bash
# 创建文件
touch filename.txt

# 创建目录
mkdir directory_name
mkdir -p parent/child/grandchild  # 递归创建

# 复制文件/目录
cp source.txt destination.txt
cp -r source_dir/ dest_dir/  # 递归复制目录

# 移动/重命名
mv old_name.txt new_name.txt
mv file.txt /path/to/destination/

# 删除
rm file.txt
rm -r directory_name/     # 递归删除目录
rm -rf directory_name/    # 强制删除（危险！）
\`\`\`

## 查看文件内容

\`\`\`bash
# 查看整个文件
cat filename.txt

# 分页查看
less filename.txt
more filename.txt

# 查看前/后 N 行
head -n 20 filename.txt
tail -n 20 filename.txt

# 实时跟踪日志
tail -f /var/log/syslog
\`\`\``,
    },
    {
      id: "lx-02",
      title: "文件权限管理",
      tags: ["Linux", "权限", "chmod"],
      excerpt: "文件权限的查看和修改命令",
      content: `## 查看权限

\`\`\`bash
# 详细列出文件权限
ls -l

# 输出示例：
# -rw-r--r-- 1 user group 1234 Jan 1 12:00 file.txt
# ^^^^^^^^^^
# | |  |  |
# | |  |  +-- 其他人权限 (r--)
# | |  +----- 组权限 (r--)
# | +-------- 所有者权限 (rw-)
# +---------- 文件类型 (-表示文件，d 表示目录)
\`\`\`

## 修改权限 (chmod)

\`\`\`bash
# 符号模式
chmod u+x file.txt        # 给所有者添加执行权限
chmod g-w file.txt        # 移除组写权限
chmod o=r file.txt        # 设置其他人只读
chmod a+x file.txt        # 给所有人添加执行权限

# 数字模式
chmod 755 file.txt        # rwxr-xr-x
chmod 644 file.txt        # rw-r--r--
chmod 700 file.txt        # rwx------
chmod 400 file.txt        # r--------

# 常见权限值：
# 4 = read, 2 = write, 1 = execute
# 7 = 4+2+1 = rwx, 6 = 4+2 = rw-, 5 = 4+1 = r-x
\`\`\`

## 修改所有者

\`\`\`bash
# 修改文件所有者
chown user file.txt
chown user:group file.txt

# 递归修改目录所有者
chown -R user:group directory/
\`\`\``,
    },
    {
      id: "lx-03",
      title: "进程管理命令",
      tags: ["Linux", "进程", "ps"],
      excerpt: "进程的查看、管理和控制命令",
      content: `## 查看进程

\`\`\`bash
# 查看当前终端进程
ps

# 查看所有进程
ps aux

# 树状显示进程
pstree

# 动态查看进程 (top)
top
htop  # 更友好的界面

# 按名称查找进程
pgrep nginx
ps aux | grep nginx
\`\`\`

## 终止进程

\`\`\`bash
# 正常终止
kill <PID>
kill -TERM <PID>

# 强制终止
kill -9 <PID>
kill -KILL <PID>

# 按名称终止
pkill nginx
killall nginx

# 发送其他信号
kill -HUP <PID>    # 重新加载配置
kill -USR1 <PID>   # 用户自定义信号 1
\`\`\`

## 后台任务管理

\`\`\`bash
# 后台运行
command &

# 查看后台任务
jobs

# 切换到前台
fg %1

# 切换到后台
bg %1

# Ctrl+Z 暂停当前任务
# 然后使用 bg 或 fg 控制
\`\`\``,
    },
    {
      id: "lx-04",
      title: "磁盘与存储管理",
      tags: ["Linux", "磁盘", "存储"],
      excerpt: "磁盘空间查看和管理命令",
      content: `## 磁盘空间查看

\`\`\`bash
# 查看磁盘使用情况
df -h

# 查看目录/文件大小
du -sh /path/to/directory
du -ah --max-depth=1 /path/  # 查看一级子目录大小

# 查找大文件
find / -type f -size +100M
\`\`\`

## 挂载操作

\`\`\`bash
# 查看已挂载文件系统
mount
df -h

# 挂载设备
mount /dev/sdb1 /mnt/data

# 卸载
umount /mnt/data

# 查看 fstab 配置
cat /etc/fstab
\`\`\`

## 清理空间

\`\`\`bash
# 查找并删除空目录
find /path -type d -empty -delete

# 清空文件内容
> large_file.log
truncate -s 0 large_file.log

# 清理 apt 缓存 (Debian/Ubuntu)
apt-get clean
apt-get autoremove
\`\`\``,
    },
    {
      id: "lx-05",
      title: "网络相关命令",
      tags: ["Linux", "网络", "curl"],
      excerpt: "网络配置、测试和调试命令",
      content: `## 网络配置查看

\`\`\`bash
# 查看 IP 地址
ip addr show
ifconfig  # 旧命令

# 查看路由表
ip route show
route -n

# 查看 DNS 配置
cat /etc/resolv.conf

# 查看网络连接
netstat -tulpn
ss -tulpn  # 推荐替代 netstat
\`\`\`

## 网络测试

\`\`\`bash
# Ping 测试
ping google.com
ping -c 4 google.com  # 发送 4 个包

# 追踪路由
traceroute google.com
tracepath google.com

# DNS 查询
nslookup google.com
dig google.com
host google.com
\`\`\`

## 网络请求

\`\`\`bash
# HTTP 请求
curl https://api.example.com
curl -X POST -d "key=value" https://api.example.com
curl -H "Authorization: Bearer token" https://api.example.com

# 下载文件
curl -O https://example.com/file.zip
wget https://example.com/file.zip

# 测试端口连通性
telnet host 80
nc -zv host 80
\`\`\``,
    },
    {
      id: "lx-06",
      title: "文本处理命令",
      tags: ["Linux", "文本处理", "grep"],
      excerpt: "文本搜索、过滤和处理命令",
      content: `## grep 搜索

\`\`\`bash
# 基本搜索
grep "pattern" file.txt

# 递归搜索
grep -r "pattern" /path/to/dir/

# 忽略大小写
grep -i "pattern" file.txt

# 显示行号
grep -n "pattern" file.txt

# 反向匹配
grep -v "pattern" file.txt

# 正则表达式
grep -E "^[0-9]+" file.txt
grep -P "\\d{3}-\\d{4}" file.txt
\`\`\`

## sed 流编辑

\`\`\`bash
# 替换（不修改原文件）
sed 's/old/new/' file.txt
sed 's/old/new/g' file.txt  # 全局替换

# 修改原文件
sed -i 's/old/new/g' file.txt

# 删除行
sed '/pattern/d' file.txt
sed -i '5d' file.txt  # 删除第 5 行

# 打印特定行
sed -n '5,10p' file.txt
\`\`\`

## awk 文本分析

\`\`\`bash
# 打印特定列
awk '{print $1}' file.txt
awk -F: '{print $1}' /etc/passwd  # 指定分隔符

# 条件过滤
awk '$3 > 100' file.txt

# 计算总和
awk '{sum += $1} END {print sum}' file.txt

# 格式化输出
awk '{printf "%-20s %s\\n", $1, $2}' file.txt
\`\`\``,
    },
  ],
};
