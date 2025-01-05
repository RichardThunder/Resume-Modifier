# Resume-Modifier-FrontEnd

一个简历修改器的前端部分

## 页面预览如下:
![img.png](image/index.png)
## 生成pdf如下:
![img_2.png](image/pdf.png)

- 处理pdf使用了 html2pdf
- 需要在container的样式中添加

    ```css
    .resume-container {
    page-break-inside: avoid;
    break-inside: avoid;
    }
    ```
    防止文字被上下截断
## 使用 How To Use
```shell
//安装依赖
npm install
```
```
//启动项目
npm run dev
```
此时可以访问http://localhost:5173/ 来使用项目
## TODO
- ~~删除功能~~
- 组件化
- 实现undo
- 实现 re-analysis
- 日期输入校验(开始<结束)
