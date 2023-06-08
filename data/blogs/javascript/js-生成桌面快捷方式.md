---
title: js-生成桌面快捷方式
date: '2023-06-08'
summary: '通过 js 生成桌面快捷方式'
draft: false
tags: ['javascript']
canonicalUrl: ''
---

### 需求

近期有个需求：需要网页端有个按钮可以点击后生成该网址的桌面快捷方式。

### 思路

将步骤分解为如下几个细节点：

- 桌面快捷方式是什么格式的文件？它的内容有什么规律或编写规则？【研究：文件名称、文件内容】
详细参考：.url文件说明2 ；

- 如何定义指定网页的快捷方式代码？【定义.url快捷方式：名称、内容】

- JS 如何编写文件生成的程序代码？【执行：程序编写】

- JS 如何生成快捷方式文件？【执行：程序运行】

- JS 如何生成到桌面？【执行：指定生成路径】

### 实现

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>创建快捷方式</title>
</head>
<body>


创建快捷方式：<a href="javascript:void(0);" onclick="shoucang('csdn','.url','http://www.csdn.net/')">点击创建</a>
<script type="text/javascript">
	//var shortcutname="csdn";
	//var httpurl = 'https://www.csdn.net/';
	//var scriptstr = '[InternetShortcut]'+'\n'+'URL='+httpurl;
	
	
	function shoucang(a,b,c){
		var d = ''+a+b;
		var e = '[InternetShortcut]'+'\n'+'URL='+c;
		saveToDesktop(d,e);
	}
</script>

<script type="text/javascript">
	        /**
         * [
         *     saveToDesktop 
         *     IE:可以将数据写进文件并保存到桌面；
         *     fireFox:可以选择路径将写进数据的文件保存；
         *     chrome:只能保存到浏览器指定的下载目录下；
         * ]
         * @param  {[string]} fileName [文件名 如："test.txt"]
         * @param  {[string]} data     [数据 如："username:key \r\n password:123456"]
         */
        function saveToDesktop(fileName, data) {
            var explorer = navigator.userAgent.toLowerCase();
            if (explorer.indexOf("trident") > 0) {//IE 5+
                var wss = new ActiveXObject("WScript.Shell");
                var desktopUrl = wss.SpecialFolders("Desktop");
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var tf = fso.CreateTextFile(desktopUrl + "\\" + fileName, true);
                tf.Write(data);
                tf.Close();
            } else {//fireFox chrome
                var urlObj = window.URL || window.webkitURL || window;
                var blob = new Blob([data]);
                var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                link.href = urlObj.createObjectURL(blob);
                link.download = fileName;
                saveClick(link);
            }

            function saveClick(obj) {
                var e = document.createEvent("MouseEvents");
                e.initMouseEvent(
                    "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
                );
                obj.dispatchEvent(e);
            }
        }
</script>
</body>
</html>
```