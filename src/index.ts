import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// 添加域名白名单 - 配置你需要下载图片的域名
// 注意：只需填写主域名，会自动支持其子域名
basekit.addDomainList([
  'cpolar.cn',            // 支持 xxb_image.cpolar.cn 等子域名
  'feishu.cn',            // 飞书域名
  'bytednsdoc.com',       // 字节跳动域名
]);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'urlField': '请选择包含链接的字段',
        'urlFieldPlaceholder': '选择包含图片URL的文本字段',
        'attachmentName': '附件',
      },
      'en-US': {
        'urlField': 'Select field containing URL',
        'urlFieldPlaceholder': 'Select text field with image URL',
        'attachmentName': 'Attachment',
      },
      'ja-JP': {
        'urlField': 'URLを含むフィールドを選択',
        'urlFieldPlaceholder': '画像URLを含むテキストフィールドを選択',
        'attachmentName': '添付ファイル',
      },
    }
  },
  // 定义捷径的入参 - 接收文本字段作为输入
  formItems: [
    {
      key: 'urls',
      label: t('urlField'),
      component: FieldComponent.FieldSelect,
      props: {
        placeholder: t('urlFieldPlaceholder'),
        supportType: [FieldType.Text],  // 支持文本类型字段
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型为附件
  resultType: {
    type: FieldType.Attachment,
  },
  // formItemParams 为运行时传入的字段参数
  execute: async (formItemParams: { urls: Array<{ type: string; text: string; link?: string }> | string }, context) => {
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      console.log(JSON.stringify({
        formItemParams,
        arg
      }));
    }

    try {
      debugLog({ '===1 收到的参数': formItemParams });

      // 处理urls字段 - 可能是数组或字符串
      let urlText = '';
      const { urls } = formItemParams;

      if (Array.isArray(urls)) {
        // 如果是文本字段数组格式
        const textSegment = urls.find(item => item.type === 'text' || item.type === 'url');
        if (textSegment) {
          urlText = textSegment.link || textSegment.text || '';
        }
      } else if (typeof urls === 'string') {
        urlText = urls;
      }

      debugLog({ '===2 解析到的URL': urlText });

      // 验证URL
      if (!urlText || !urlText.trim()) {
        debugLog({ '===3 URL为空': urlText });
        return {
          code: FieldCode.ConfigError,
        };
      }

      // 清理URL（去除首尾空格）
      const cleanUrl = urlText.trim();

      // 从URL中提取文件名
      let fileName = '';
      try {
        const urlObj = new URL(cleanUrl);
        const pathParts = urlObj.pathname.split('/');
        fileName = pathParts[pathParts.length - 1] || 'image.jpg';

        // 如果文件名没有扩展名，添加默认扩展名
        if (!fileName.includes('.')) {
          // 尝试从URL推断类型
          if (cleanUrl.includes('.png')) {
            fileName += '.png';
          } else if (cleanUrl.includes('.gif')) {
            fileName += '.gif';
          } else if (cleanUrl.includes('.webp')) {
            fileName += '.webp';
          } else {
            fileName += '.jpg';
          }
        }
      } catch (e) {
        fileName = 'image.jpg';
      }

      debugLog({ '===4 文件名': fileName, 'URL': cleanUrl });

      // 返回附件格式
      return {
        code: FieldCode.Success,
        data: [
          {
            name: fileName,                // 附件名称，需要带有文件格式后缀
            content: cleanUrl,             // 可通过 http.Get 请求直接下载的 URL
            contentType: 'attachment/url', // 固定值
          }
        ],
      };

    } catch (e) {
      console.log('====error', String(e));
      debugLog({ '===999 异常错误': String(e) });
      return {
        code: FieldCode.Error,
      };
    }
  },
});

export default basekit;