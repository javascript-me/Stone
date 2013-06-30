Stone
=====
君当作磐石，妾当作蒲苇。蒲苇纫如丝，磐石无转移。

如何跑当前的测试代码？
=====================

```
cd /c/doc/dev/Office/JavaScriptThinker/Stone
node src/index.js

cd /c/doc/dev/Office/JavaScriptThinker/Stone
mocha test/uploaderTest.js
```

然后去到某个目录，使用以下命令来上传文件。

```
cd /c/doc/dev/Office/JavaScriptThinker/image-home
npm pack
node /c/doc/dev/Office/JavaScriptThinker/Stone/test/uploader.js
```

去到TeamCity - http://localhost:9000/overview.html里进行run的指令跑一个部署，然后打开

http://localhost:9999/list

Deploy你想部署的东西，然后打开部署好的site。

http://localhost:8888/


TODO
====

[OK]1、上传一个文件，保存到temp目录里。

[OK]2、重构当前的代码。

[OK]1）把文件上传到Temp目录里。

[OK]2）写一个单元测试，用于验证temp目录里有没有一个ok.bin文件。

[OK]3、建立一个新项目，对其使用npm pack命令。

[OK]4、把xxx.tar.gz文件名作为uploaderTest.js的入参。

5、把temp目录改名为repository。

[OK]6、制作一个页面，列出repository目录里的包。

[OK]7、Uploader命令不需要提供文件名，而是直接搜索目录下面的package.json文件，取得相应的版本号。

8、用面向对象的方式来改造我的代码。

[Ignore]9、提供一个页面上的按钮，点击之后可以把包解压到目标目录。

[Ignore]10、启动对应的node index.js命令。

[[Ignore]]11、待完善的地方还有很多。

12、清除不必要的测试文件。

=>13、使用自己的logger。

14、把logger的信息展示到网页里。

=>15、在把当前的环境清洗干净之前——把一切重复的地方消除，哪里也不去。

16、对Deploy进行功能测试。

17、把stone换成其它的名字。如puwei。

