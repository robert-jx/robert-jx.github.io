---
title: python-坐标对比的GUI程序实现
date: '2025-03-03'
summary: ''
draft: false
tags: ['python','tkinter','os']
canonicalUrl: ''
---

最近研习 `python` 的时候，遇到一个需求：需要把一个文件中的两组坐标数组数据进行整合抽取，并在其中找出所有符合位置相近的坐标从而获取均差

这里为了方便使用，我引用了 `tkinter` 来生成 GUI 程序，并通过 `os` 来对文件进行操作，最后使用自带的 `statistics` 库来实现均差的计算。

### 整体代码

```python
import statistics
from tkinter import *
from tkinter import filedialog
from tkinter import scrolledtext
import os
import json

root = Tk()
root.title('数据分析')
# root.iconbitmap('test.ico')
root.geometry('700x500')
# root.config(bg='white')

content = ''
def handle_click():
    file_path = filedialog.askopenfilename()  # 打开文件对话框
    if file_path:  # 如果用户选择了文件
        print("选中的文件：", file_path)
        # 你可以在这里添加更多代码来处理文件，例如读取文件内容或验证格式
        file_extension = os.path.splitext(file_path)[1]  # 获取文件扩展名
        print("文件扩展名：", file_extension)
        # 控制文件格式，例如只允许特定格式的文件
        if file_extension in ['.csv']:  # 例如，只允许txt和csv文件
            print("已接受的文件格式")
            entry1.insert(0, file_path)
            # 打开并读取文件内容
            with open(file_path, 'r', encoding='utf-8') as file:
              global content
              content= file.read()
            # 在Text组件中显示文件内容
            text_area.delete('1.0', END)  # 清空Text组件
            text_area.insert(END, content)  # 插入文件内容
        else:
            print("不支持的文件格式")
    else:
        print("未选择文件")
        return

frm = Frame(root)
frm.grid(padx='20', pady='10')

button = Button(frm,text="上传文件",activeforeground="blue", activebackground="#999",command=handle_click)
button.grid(row=0, column=0, ipadx='3', ipady='3', padx='10', pady='20')

entry1 = Entry(frm, width=40)
entry1.grid(row=0, column=1)

# 创建滚动文本区域以显示文件内容
text_area = scrolledtext.ScrolledText(root, wrap=WORD, width=80, height=20)
text_area.grid(padx='20',pady=20)

result = []

def get_mean_deviation():
    global result
    f_list = content.split('\n')
    r_list = []
    for i in f_list:
        if i== '':
            pass
        else:
            m = i.split(',')
            print(m)
            r_list.append(m)
    r_list1 = r_list
    for i in r_list:
        for m in r_list1:
            if i[0]==m[0] and i[1]==m[1]:
                pass
            else:
                if abs(json.loads(i[0]) - json.loads(m[0]))<1 and abs(json.loads(i[1]) - json.loads(m[1]))<1:
                    result.append(abs(json.loads(i[0]) - json.loads(m[0])) + abs(json.loads(i[1]) - json.loads(m[1])))
    entry2.insert(0,statistics.mean(result))

act_frm = Frame(root)
act_frm.grid(padx='20', pady='0')

mean_deviation = Button(act_frm,text="获取均差",command=get_mean_deviation)
mean_deviation.grid(row=0, column=0, ipadx='3', ipady='3', padx='10', pady='20')

entry2 = Entry(act_frm, width=40)
entry2.grid(row=0, column=1)

mainloop()
```