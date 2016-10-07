/**
 * ajax封装
 * @type {[type]}
 */
(function(){

    function createXHR() {
        if (window.XMLHttpRequest) {	//IE7+、Firefox、Opera、Chrome 和Safari
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {   //IE6 及以下
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            throw new Error('浏览器不支持XHR对象！');
        }
    }

    function ajax(obj) {
        var xhr=createXHR();
        obj.dataType=obj.dataType||"json";
        obj.data=params(obj.data||{});
        if(obj.dataType=="jsonp"){//jsonp方式
            jsonp(obj);
            return;
        }
        obj.async=obj.async||true;
        obj.method=obj.method||"post";

        //通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
        obj.url = obj.url + '?rand=' + Math.random();
        if (obj.method === 'post') {
          //post方式需要自己设置http的请求头，来模仿表单提交。
          //放在open方法之后，send方法之前。
            xhr.open(obj.method,obj.url,obj.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(obj.data);		//post方式将数据放在send()方法里
        } else {
            obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
            xhr.open(obj.method,obj.url,obj.async);
            xhr.send(null);		//get方式则填null
        }

        if(obj.async){
            xhr.onreadystatechange= function(){//使用异步调用的时候，需要触发readystatechange 事件
                if(xhr.readyState == 4){//判断对象的状态是否交互完成
                	// console.log(xhr);
                    callback(xhr);
                }
              }
        }else{
            callback(xhr);
        }
        //响应
        function callback(xhr){
            if(xhr.status >= 200 && xhr.status<300||xhr==304){
                obj.success(xhr.responseText);
            }else{
                console.log("Error:"+xhr.status);
            }
        }

    }

    /**
     * jsonp实现
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    function jsonp(obj){
        // 生成随机函数名并指向传入的回调函数
        // var callbackfun = "callbackfun_" + randomString(32);
        // eval( callbackfun+ " = obj.success; ");
        // obj.url += "?callback="+callbackfun;
        var callbakfun=obj.success;
        obj.url += "?callback=callbakfun";
        obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
        var script=document.createElement("script");
        script.setAttribute("src",obj.url);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    // 生成随机字符串
    function randomString(len) {
        len = len || 32;
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnoprstuvwxyz1234567890";
        var maxPos = chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    //名值对转换为字符串
    function params(data) {
      var arr = [];
      for (var i in data) {
        //特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
        arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
      }
      return arr.join('&');
    }
    window.ajax=ajax;
})();



//使用示例

// ajax({
//   dataType:'json'
//   method:'post',
//   url:'demo.html',
//   data:{},
//   success:function(){
//
//   },
//   async:true
//
// });
