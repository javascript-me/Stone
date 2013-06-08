Stone
=====
君当作磐石，妾当作蒲苇。蒲苇纫如丝，磐石无转移。

如何跑当前的测试代码？
=====================

```
node src/index.js
mocha test/uploaderTest.js
```

然后去到某个目录，使用以下命令来上传文件。

cd /c/doc/dev/Office/JavaScriptThinker/image-home
node /c/doc/dev/Office/JavaScriptThinker/Stone/test/uploader.js image-home-0.0.0.tgz



TODO
====

[OK]1、上传一个文件，保存到temp目录里。
2.、重构当前的代码。
[OK]1）把文件上传到Temp目录里。
[OK]2）写一个单元测试，用于验证temp目录里有没有一个ok.bin文件。
[OK ]3、建立一个新项目，对其使用npm pack命令。
[OK]4、把xxx.tar.gz文件名作为uploaderTest.js的入参。



