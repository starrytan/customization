# customization

div分割器插件

**原理框图:**

![](C:\Users\Starry\Desktop\QQ截图20190311060239.jpg)

![](C:\Users\Starry\Desktop\GIF.gif)



第一次拖动时利用jq拖拽库Tdrag.js，拉出直线形式的div，放下鼠标删除该div，利用坐标操作数组，触发渲染事件，分割div。

**使用方法：**

将js和css引入页面,调用Editworkspace.option()方法即可,此函数有四个参数：

width 工作面板宽度

*height 工作面板高度*

*num 背景网格分割份数（以高为基础）*

target 编辑区域的父级元素，id选择器，传入body自动选择body*。

调用Editworkspace.getreslut()即可获取JSON数据。

**分割工作区：**

鼠标放入工作面板四条边的任意一条，蓝色区域放大，按下鼠标左键即可拖拽一条分割线对页面进行分割。

**改变工作区大小：**

鼠标移至分割线右侧附近，当鼠标变成双箭头，按下鼠标左键，即可拖拽改变div长宽。

**删除工作区：**

当改变工作区大小使某个工作区的宽度为0即可删除该工作区。