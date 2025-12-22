# 链接转附件 - 飞书多维表格字段捷径插件

将文本字段中的 URL 链接自动转换为附件字段，支持图片预览。

## 功能特性

- ✅ 支持文本字段中的 URL 自动转换为附件
- ✅ 自动识别文件名和扩展名
- ✅ 支持 jpg/png/gif/webp 等图片格式
- ✅ 多语言支持（中文/英文/日文）

## 使用方法

1. 在多维表格中添加「链接转附件」字段捷径
2. 选择包含 URL 的文本字段
3. 自动生成附件并显示图片预览

## 开发调试

```bash
# 安装依赖
npm install

# 启动本地服务
npm run start

# 打包发布
npm run pack
```

## 项目结构

```
├── config.json         # 本地调试配置
├── package.json        # 项目依赖
├── src/
│   └── index.ts        # 主入口文件
├── output/
│   └── output.zip      # 打包文件
└── tsconfig.json       # TypeScript 配置
```

## 域名白名单

如需添加新的图片域名，请修改 `src/index.ts` 中的 `addDomainList`：

```typescript
basekit.addDomainList([
  'cpolar.cn',
  'feishu.cn',
  'your-domain.com',  // 添加你的域名
]);
```

## 许可证

MIT