/**
  @param width 工作面板宽度
  @param height 工作面板高度
  @param num 背景网格分割份数（以高为基础）
 */

(function(){
  var Editworkspace={
    reslut:'',
    getreslut:function(){
      return Editworkspace.reslut
    },
    option:function(width,height,num,target){
//生成编辑面板
var box=document.createElement('div')
box.style.height=height+'px';
box.style.width=width+'px'
var main=document.createElement('div')
box.setAttribute('id','box');
main.setAttribute('id','main')
var canvas=document.createElement('canvas')
var tar
if(target=='body'){
  tar=document.body
}else{
  tar=document.getElementById('target')
}
tar.appendChild(box)
box.appendChild(main)
box.appendChild(canvas)

//获得工作面板宽高
var boxheight=height;
var boxwidth=width;
var min=boxheight/num//50代表把高分割成50份
//绘制背景网格
canvas.width = boxwidth;
canvas.height = boxheight;
var context = canvas.getContext("2d");
for (var i = 1; i <num; i++) {
  context.moveTo(0, min * i);
  context.lineTo(boxwidth, min * i);
  context.strokeStyle = "#dddddd";
  context.stroke();
}
for (var j = 1; j < boxwidth /min; j++) {
  context.moveTo(min * j, 0);
  context.lineTo(min * j, boxheight);
  context.strokeStyle = "#dddddd";
  context.stroke();
}
//渲染数据
var arrdata = [];
//渲染方法
function rendering(){
  Editworkspace.reslut=arrdata
  console.log('渲染源数据', arrdata);
  //清空节点
  main.innerHTML = "";
  if (arrdata.length){
    for (var data of arrdata){
      //渲染行
      var newhdiv = document.createElement("div");
      newhdiv.classList.add("all");
      newhdiv.style.height = data.height;
      newhdiv.style.width = data.width;
      data.col.map((ab, count, self) => {
        //渲染列
        var newlie = document.createElement("div");
        newlie.classList.add("all");
        newlie.style.width = ab.width;
        newlie.style.height = ab.height;
        //给div添加左边框
        if (count != 0) {
          newlie.classList.add("leftborder");
          var start;//存当前鼠标位置
          var start1;//存上一个div的right
          var start2;//存上一个div的width
          var start3;//存这个div的width
          //鼠标移动函数
          function move(e){
            if (e.clientX > box.offsetLeft + 3) {
              if (start1 + e.clientX - start > start1 + start3){
                self[count - 1].right = start1 + start3;
                self[count - 1].width = start2 + start3 + "px";
                self[count].width = "0px";
                $("body").unbind();
              } else if (start1 + e.clientX - start < start1 - start2) {
                self[count - 1].right = start1 - start2;
                self[count].width = start2 + start3 + "px";
                self[count - 1].width = "0px";
                $("body").unbind();
              } else {
                if(e.clientX-start>=min||e.clientX-start<=-min){
                var i=Math.floor((e.clientX-start)/min)          
                self[count - 1].right = start1 + min*i;
                self[count - 1].width = start2 + min*i + "px";
                self[count].width = start3 - min*i + "px";
                }
              }
            } else {
              self[count - 1].width = "0px";
              self[count].width = start3 + start2 + "px";
            }
            //删除width为0的元素
            self.forEach((element, index) => {
              if (parseInt(element.width) <= 0) {
                self.splice(index, 1);
                $("body").unbind();
              }
            });
            rendering();
          }
          //控制鼠标样式
          function mouse(e) {
            if (e.clientX - box.offsetLeft - self[count - 1].right < 15){
              newlie.style.cursor = "e-resize";
            } else {
              newlie.style.cursor = "auto";
            }
          }
          $(newlie).on("mousemove", mouse);
          newlie.onmousedown = function(e) {
            start = e.clientX;
            start1 = self[count - 1].right;
            start2 = parseInt(self[count - 1].width);
            start3 = parseInt(self[count].width);
            if (e.clientX - box.offsetLeft - self[count - 1].right < 15) {
              $("body").on("mousemove", move);
            }
          };
          newlie.onmouseup = function() {
            console.log('鼠标松开');               
            $("body").unbind();
          };
        }
        newhdiv.appendChild(newlie);
      });
      main.appendChild(newhdiv);
    }
  }
}
//改变大小方法
function changesize() {}
//增加列
function addlie(x) {
  if (arrdata.length == 0) {
    arrdata.push({
      height: boxheight+"px",
      width: "100%",
      top: "0",
      bottom: boxheight,
      col: [
        { width: x + "px", height: "100%", right: x },
        { width: boxwidth-2 - x + "px", height: "100%", right: boxwidth-2 }
      ]
    });
  } else {
    for (var everyh of arrdata) {
      var index = everyh.col.findIndex(item => item.right > x);
      var lastwidth = parseInt(everyh.col[index].width);
      var lastright = everyh.col[index].right;
      everyh.col[index].width = everyh.col[index - 1]
        ? x - everyh.col[index - 1].right + "px"
        : x + "px";
      everyh.col[index].right = x;
      everyh.col.splice(index + 1, 0, {
        width: lastwidth - parseInt(everyh.col[index].width) + "px",
        height: "100%",
        right: lastright
      });
    }
  }
  rendering();
}
//增加行
function addhang(y) {
  if (arrdata.length == 0){
    arrdata.push({
      width: "100%",
      height: y + "px",
      col: [{ width: boxwidth-2 + "px", height: "100%", right: boxwidth-2 }],
      bottom: y
    });
    arrdata.push({
      width: "100%",
      height: boxheight - y + "px",
      col: [{ width: boxwidth-2 + "px", height: "100%", right: boxwidth-2 }],
      bottom: boxheight
    });
  } else {
    var mid = JSON.stringify(arrdata);
    var index = arrdata.findIndex(item => item.bottom > y);
    var lastheight = arrdata[index].height;
    var lastbottom = arrdata[index].bottom;
    arrdata[index].height = arrdata[index - 1]
      ? y - arrdata[index - 1].bottom + "px"
      : y + "px";
    arrdata[index].bottom = y;
    arrdata.splice(index + 1, 0, {
      width: "100%",
      height: parseInt(lastheight) - parseInt(arrdata[index].height) + "px",
      col: JSON.parse(mid)[index].col,
      bottom: lastbottom
    });
  }
  rendering();
}
$(function(){
//生成列
function right_sidebar(val) {
  var y = document.createElement("div");
  y.classList.add(val);
  y.classList.add("y");
  y.classList.add('aa');
  box.append(y);
  var pd = true;
  $(y).Tdrag({
    scope: "#box",
    axis: "x",
    grid: [min, min],
    cbStart: function() {
      y.classList.remove('aa')         
      if (!y.style.left) {
        right_sidebar(val)
        pd = true;
      } else {
        pd = false;
      }
    }, //移动前的回调函数
    cbMove: function() {}, //移动中的回调函数
    cbEnd: function() {
      if (!y.style.left||y.style.left == "0px" || y.style.left == boxwidth+"px") {
        box.removeChild(y);
      } else {
        if (pd) {
          box.removeChild(y);
          addlie(parseInt(y.style.left));
        }
      }
    } //移动结束时候的回调函数
  });
}
right_sidebar('a')
right_sidebar('c')
//生成行
 function bottom_topclic(val){
  var x = document.createElement("div");
  x.classList.add(val);
  x.classList.add('bb');
  x.classList.add("x");
  box.append(x);
  var pd = true;
  var initialtop;
  var indexc;
  var xtrue = true;
  var start;
  var start1;
  $(x).Tdrag({
    scope: "#box",
    axis: "y",
    grid: [min, min],
    cbStart: function() {
      x.classList.remove('bb')          
      if (!x.style.top) {
        bottom_topclic(val)
        pd = true;
      } else {
        pd = false;
        initialtop = parseInt(x.style.top);
        arrdata.map((item, index) => {
          if (parseInt(x.style.top) == item.bottom) {
            indexc = index;
            start = parseInt(item.height);
            start1 = parseInt(arrdata[index + 1].height);
          }
        });
      }
    }, //移动前的回调函数
    cbMove: function() {
      if (!pd) {
        //改变行高
        if (xtrue){
          arrdata[indexc].height = arrdata[indexc - 1]
            ? parseInt(x.style.top) - arrdata[indexc - 1].bottom + "px"
            : x.style.top;
          if (arrdata[indexc - 1]) {
            arrdata[indexc].bottom =
              parseInt(x.style.top) >
              arrdata[indexc - 1].bottom + start + start1
                ? arrdata[indexc - 1].bottom + start + start1
                : parseInt(x.style.top);
          } else {
            arrdata[indexc].bottom =
              parseInt(x.style.top) > start + start1
                ? start + start1
                : parseInt(x.style.top);
          }
          arrdata[indexc + 1].height =
            arrdata[indexc + 1].bottom - parseInt(x.style.top) + "px";
          if (parseInt(arrdata[indexc].height) <= 0) {
            if (parseInt(arrdata[indexc + 1].height) > start + start1){
              arrdata[indexc + 1].height == start + start1 + "px";
            }
            xtrue = false;
            box.removeChild(x);
            arrdata.splice(indexc, 1);
          } else if (parseInt(arrdata[indexc + 1].height) <= 0) {
            if (parseInt(arrdata[indexc].height) > start + start1){
              arrdata[indexc].height = start + start1 + "px";
            }
            xtrue = false;
            box.removeChild(x);
            arrdata.splice(indexc + 1, 1);
          }
          rendering();
        }
      }
    }, //移动中的回调函数
    cbEnd: function() {
      if (xtrue) {
        if (pd) {
          if (
            !x.style.top ||
            x.style.top == boxheight+"px" ||
            x.style.top == "0px"
          ) {
            box.removeChild(x);
          } else if (x.style.top && x.style.top != "0px") {
            addhang(parseInt(x.style.top));
          }
        }
      }
    } //移动结束时候的回调函数
  });
};
bottom_topclic('b')
bottom_topclic('d')
})
    } 
  }
  this.Editworkspace=Editworkspace
})()
