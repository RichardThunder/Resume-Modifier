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

## Getting Started

### Dependencies and Installing

install dependencies

```shell

npm install
```

### Executing program

```shell

npm run dev
```

project default in http://localhost:5173

### Using Docker

```shell

docker build -t resume-modifier-front-end  .
docker run -d resume-modifier-front-end:0.1 -p 8000:80 --name resume-modifier-front-end
```

Service is available on http://localhost:8000

## Help
Any advice for common problems or issues are welcomed.

## Authors
[Richardthunder](https://github.com/RichardThunder)

[Andrlulu](https://github.com/Andrlulu)

[yongxin12](https://github.com/yongxin12)

## License

This project is licensed under the  GPL-3.0 license - see the LICENSE.md file for details
## Acknowledgments
[nochhz](https://github.com/enochhz)


[图灵星球 TuringPlanet](https://turingplanet.org/)
