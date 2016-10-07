// 初始化
function init(){
  topNoticeInit();//顶部栏初始化
  sliderInit();//轮播图初始化
  attbtnInit();//关注按钮初始化
  tabInit();//tab初始化
  mainInit();//主栏数据初始化
  sideInit();//侧边栏初始化
  videoPopInit();//视频弹窗初始化
}
init();

// 视频播放初始化
function videoPopInit(){
  var img=document.querySelector('.g-bottom .g-side .m-video img');
  var pop=document.getElementById('popup-video');
  var close=pop.getElementsByClassName('close')[0];
  var video=pop.getElementsByTagName('video')[0];
  img.onclick=function(){
    pop.style.display="block";
  }
  close.onclick=function(){
    video.pause();
    pop.style.display="none";
  }

}
//关注按钮初始化
function attbtnInit(){
  var btn=document.querySelector('.m-botnav .attention ');
  var pop=document.getElementById('popup-login');
  var close=pop.querySelector('.close');
  var loginSuc=getCookieValue("loginSuc");//登陆状态
  var logbtn=document.getElementById('login');//登陆按钮
  var att=document.getElementById('attention');//关注按钮
  var attCancel=document.getElementById('attCancel');//取消关注按钮
  //判断是否登陆 未登录添加弹窗事件
  if(!loginSuc){
    btn.onclick=function(){
      pop.style.display="block";
    }
    close.onclick=function(){
      pop.style.display="none";
    }
    addEvent(logbtn,"click",login);
  }else{
    //已登陆 进行关注按钮设置
    var followSuc=getCookieValue("followSuc");
    if(!!followSuc){
      //cookie存在 修改关注样式
      changeAttBtnStyle();
    }else{
      //不存在 关注按钮添加事件
      att.onclick=attention;

    }
  }
}
//登陆及验证
function  login(event){
  var btn=document.querySelector('.m-botnav .attention ');//关注按钮
  var pop=document.getElementById('popup-login');//登陆弹窗
  var userName=document.getElementById('userName').value;
  var password=document.getElementById('password').value;
  if(!!userName && !!password){
    userName=hex_md5(userName);
    password=hex_md5(password);
    ajax({
      //dataType:'jsonp',
      method:'get',
      url:'http://study.163.com/webDev/login.htm',
      data:{
        'userName':userName,
        'password':password
      },
      success:function(data){
        //跨域问题不知道为什么没有跨域问题了
        if(data==1){
          setCookie("loginSuc",userName,1);
          alert("登陆成功")
          pop.style.display="none";
          btn.onclick=null;
          //添加关注
          attention();
        }else{
          alert("账号或密码错误");
        }
      }
    });
  }else if(!userName){ //验证什么时候单独进行一次onblur
    alert("账号不能为空");
    return;
  }else if(!password){
    alert("密码不能为空");
    return;
  }

}

//调用关注api进行添加操作
function attention(){
  //添加关注
  ajax({
    method:'get',
    url:'http://study.163.com/webDev/attention.htm',
    success:function(data){
      if(data==1){
        changeAttBtnStyle();
      }
    }
  });
}


//修改关注按钮样式
function changeAttBtnStyle(){
  var att=document.getElementById('attention');//关注按钮
  var attCancel=document.getElementById('attCancel');//取消关注按钮
  if(att.innerText=="关注"){
    setCookie("followSuc","true",1);
    att.className="active f-fl";
    att.innerText="已关注";
    attCancel.style.display="inline-block";
    attCancel.onclick=changeAttBtnStyle;
  }else{
    delCookie("followSuc");
    att.className="attention f-fl f-csp";
    att.innerText="关注";
    attCancel.style.display="none";
    att.onclick=attention;
  }

}

//顶部通知栏初始化
function topNoticeInit(){
  //cookie 要在服务器下才生效
    var notice=document.getElementsByClassName('m-topnav')[0];
    var close =notice.getElementsByClassName('close')[0];
    var remind=getCookieValue("remind");
    //判断是否已点击
    if(remind=="true"){
      notice.style.display="none";
    }else{
      notice.style.display="block";
      addEvent(close,'click',function(){
          notice.style.display="none";
          setCookie("remind","true",1);
      })
    }

}


//课程详细信息初始化
function detailInit(){
  var lists=document.getElementsByClassName('course-warp');
  for(var i=0,len=lists.length;i<len;i++){
      var detail=lists[i].getElementsByClassName('course-detail')[0];
      (function(dom){
        if(!!dom){
          addEvent(lists[i],"mouseover",function(event){
              dom.style.display="block";
          });
          addEvent(lists[i],"mouseout",function(){
              dom.style.display="none";
          })
        }
      })(detail);

  }
}

//侧边栏数据初始化
function sideInit(){
  var sideList=document.getElementById('sideList');
  ajax({
    method:'get',
    url:'http://study.163.com/webDev/hotcouresByCategory.htm ',
    data:{},
    success:function(data){
      data=JSON.parse(data);
      for(var i=data.length;i>=1;i--){
        // console.log(data[i-1]);
        var li=document.createElement('li');
        li.className="list-item  f-clearfix";
        var img=document.createElement('img');
        img.src=data[i-1].smallPhotoUrl;
        img.className="f-fl";
        var div=document.createElement('div');
        div.className="detail";
        div.innerHTML='<p class="f-fz1 f-thide"><a href="">'+data[i-1].name+'</a></p>\
        <span class="f-bg num">'+data[i-1].learnerCount+'</span>';
        li.appendChild(img);
        li.appendChild(div);
        sideList.appendChild(li);
      }

    },
    async:false
  });
  var i=1;
  sideList.style.transition='transform 1.5s';
  //实现滚动更新
  var intervalID=setInterval(function(){
    sideList.style.transform = 'translateY('+(-70*i)+'px) translateZ(0)';
    var dom=sideList.getElementsByTagName('li')[i-1];
    var li=document.createElement('li');
    li.className="list-item  f-clearfix";
    li.innerHTML=dom.innerHTML;
    sideList.appendChild(li);
    // sideList.style.top = 70*i+'px';
    // sideList.removeChild(dom);
    i++;
  },5000);


}

//tab初始化
function tabInit(){
  var tabs=document.getElementsByClassName("tab-head")[0];
  var productBtn=tabs.getElementsByClassName("tab")[0];
  var codeBtn=tabs.getElementsByClassName("tab")[1];
  var productList=document.getElementsByClassName("tab-product-list")[0];
  var codeList=document.getElementsByClassName("tab-code-list")[0];

  addEvent(productBtn,'click',function(){//产品设计
    if(productBtn.className.indexOf('active')==-1){
      productBtn.className="tab active";
      codeBtn.className="tab";
      productList.style.display="block";
      codeList.style.display="none";
      mainDataListInit(productList,10)//获取数据
    }
  });
  addEvent(codeBtn,'click',function(){//编程语言
    if(codeBtn.className.indexOf('active')==-1){
      codeBtn.className="tab active";
      productBtn.className="tab";
      productList.style.display="none";
      codeList.style.display="block";
      mainDataListInit(codeList,20);//获取数据
    }
  });

}

//主栏数据初始化
function mainInit(){
  var div=document.getElementsByClassName('tab-product-list')[0];
  mainDataListInit(div,10);

}
//
/**
 * 生成主列数据
 * @param  {[type]} div  存放数据的dom
 * @param  {[type]} type  类型
 * @return {[type]}      [description]
 */
function mainDataListInit(div,type){
  //使用分页组件
  var p=new pager({
    domID:"pager",
    method:'get',
    url:'http://study.163.com/webDev/couresByCategory.htm',
    pagesize:24,
    curpage:1,
    data:{"type":type},
    callback:function(data,all){
        div.innerHTML="";
        var ul=document.createElement('ul');
        data=JSON.parse(data).list;
        for(var i=0,len=data.length;i<len;i++){
          var price=data[i].price==0?"免费":'￥'+data[i].price;
          var categoryName=!!data[i].categoryName?data[i].categoryName:"无";
          var li=document.createElement('li');
          li.className="course-warp";
          li.innerHTML='<img src="'+data[i].middlePhotoUrl+'" alt="">\
          <h3 class="f-thide"><a href="">'+data[i].name+'</a></h3>\
          <p class="orgname">'+data[i].provider +'</p>\
          <p class="num f-bg">'+data[i].learnerCount  +'</p>\
          <p class="price">'+price +'</p>\
          <div class="course-detail " style="display:none">\
            <div class="warp-top f-clearfix">\
              <img class="f-fl" src="'+data[i].middlePhotoUrl+'">\
                <h3 class="f-thide"><a href="">'+data[i].name+'</a></h3>\
                <span class="studynum f-bg">'+data[i].learnerCount  +'人在学</span>\
                <p class="categoryname">发布者：'+data[i].provider +'<br>分类：'+categoryName +'</p>\
            </div>\
            <div class="warp-bot">\
              <p class="description">'+data[i].description  +'</p>\
            </div>\
          </div>'
          ul.appendChild(li);
        }
        div.appendChild(ul);
        detailInit();//详细信息初始化
    }
    });
}
/**
 * 轮播图初始化
 * @return {[type]} [description]
 */
function sliderInit(){
  var sliderdom=document.getElementById('slider');
  var lis=sliderdom.getElementsByTagName('li');
  var slider = new Slider({
    //视口容器id
    container: 'slider',
    // 图片列表
    images: [
      "./images/banner1.jpg",
      "./images/banner2.jpg",
      "./images/banner3.jpg"
    ],

    // 是否允许拖拽
    drag: true
  });
  slider.nav(0);
  //控制栏样式
  for(var i=0,len=lis.length;i<len;i++){
    (function (i){
      addEvent(lis[i],'click',function(){
        slider.nav(i);
        cleanClass();
        lis[i].className='active';
      });
    })(i);
  }
  function cleanClass(){
    for(var i=0,len=lis.length;i<len;i++){
      lis[i].className='';
    }
  }

  // 5s 自动轮播
  var roll=setInterval(function(){
    slider.next();
  },5000);
  //鼠标听课停止定时任务
  addEvent(sliderdom,'mouseover',function(){
    clearInterval(roll);
  });
  addEvent(sliderdom,'mouseout',function(){
    roll=setInterval(function(){
      slider.next();
    },5000);
  });

}

function workspaceInit(){
  var workspace=document.getElementsByClassName('m-workspace')[0];
  workspace.style.width=document.body.offsetWidth+'px';
  addEvent(window,'resize',function(){
    workspace.style.width=document.body.offsetWidth+'px';
  });
}
workspaceInit();

//添加事件 兼容低版本浏览器
function addEvent(obj,type,fn){
  if(obj.addEventListener){
    obj.addEventListener(type,fn);
  }else if(obj.attachEvent){
    obj.attachEvent('on'+type,fn);
  }else{
    obj["on"+type]=fn;
  }
}


//cookie 操作
//获取全部cooke
function getCookies(){
  var cookie={};
  var all=document.cookie;
  if(all === ""){
    return;
  }
  var list =all.split(';');
  for(var i=0,len=list.length;i<len;i++){
    var item=list[i];
    var p=item.indexOf("=");
    var name=item.substring(0,p).replace(/^\s+|\s+$/g, "");
    name=decodeURIComponent(name);
    var value=item.substring(p+1);
    value=decodeURIComponent(value);
    cookie[name]=value;
  }
  return cookie;
}
//获取指定cookie
function getCookieValue(key){
  var all=document.cookie;
  if(all === ""){
    return;
  }
  var list =all.split(';');
  for(var i=0,len=list.length;i<len;i++){
    var item=list[i];
    var p=item.indexOf("=");
    var name=item.substring(0,p).replace(/^\s+|\s+$/g, "");
    name=decodeURIComponent(name);
    if(name==key){
      var value=item.substring(p+1);
      value=decodeURIComponent(value);
      return value;
    }
  }
}

//添加设置cookie
function setCookie(name,value,expires,path,domain){
  var str=name+"="+encodeURIComponent(value);
  if(!!expires){
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + expires);//expires单位为天
    str+=";expires="+oDate.toGMTString();
  }
  if(!!path){
    str+=";path="+path;//指定可访问cookie的目录
  }
  if(!!domain){
    str+=";domain="+domain;//指定可访问cookie的域
  }
  document.cookie=str;
}




//删除cookie
function delCookie(name){
  var date=new Date();
  date.setTime(date.getTime()-10000);
  document.cookie=name+"= ;expire="+date.toGMTString();
}
