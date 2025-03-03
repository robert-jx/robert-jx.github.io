---
title: python-生成二维码
date: '2025-03-03'
summary: ''
draft: false
tags: ['python','pyqrcode']
canonicalUrl: ''
---

近期开始研究一下 `python`，以下是一个简单的二维码生成过程：

### 步骤

```js-nolint
pip install pyqrcode
```

```python
import pyqrcode
# 设置二维码信息
s = "https://robert-jx.github.io/"
# 生成二维码
url = pyqrcode.create(s)
# 保存二维码
url.svg("baidu.svg", scale=8)
```

这里使用的 `pyqrcode` 组件库快速的实现二维码功能。