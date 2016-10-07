
/**
 * 分页组件
 * 用于请求分页数据显示分页按钮
 * 依赖另一个ajax.js文件
 */


(function(){

    function pager(options){
        this._options=options;
        this._options.dom=document.getElementById(options.domID);
        this._options.domID=options.domID;
        this._options.curpage=options.curpage||1;
        this._options.pagesize=options.pagesize||10;
        this._options.url=options.url;
        this._options.data=options.data||{};
        this._options.method=options.method||"get"
        this._init(this._options);
        //_self=this;

    }

    pager.prototype= {
        /**
         * 初始化
         */
        _init:function(options){
            this._request(options);
        },
        /**
         * 数据请求
         * @return {[type]} [description]
         */
        _request:function(options){
        	var _self=this;
          var _data={};
          for(var s in options.data){
            _data[s]=options.data[s];
          }
          _data['pageNo']=options.curpage;
          _data['psize']=options.pagesize;
            ajax({
        	   method:options.method,
        	   url:options.url,
        	   data:_data,
        	   success:function(data){

        		_self._renderHTML(data,options.dom);
        		_self._options.callback(data);
        	   },
        	   async:false
        	});
        },
        /**
         * 生成HTML
         * @return {[type]} [description]
         */
        _renderHTML:function(data,dom){
            var _self=this;
            data=JSON.parse(data);
            var groups=8;//连续分页数
            var curpage=_self._options.curpage||1;//当前页
            var pagesize=_self._options.pagesize||10;//每页记录数
            var total=data.totalCount||0;//总记录数
            var totalpage=(total%pagesize)==0?Math.floor(total/pagesize):Math.floor((total/pagesize)+1);
            dom.innerHTML="";

            //首页尾页
            if(curpage>1){
              var a=document.createElement('a');
              a.className="page prev f-bg";
              a.href="javascript:void(0);";
              a.innerText=""
              dom.appendChild(a);
            }

            var s=Math.ceil(curpage/groups)-1;
            for(var i=1;i<=groups;i++){
              var num=s*groups+i;
              if(num<=totalpage){
                var a=document.createElement('a');
                a.innerText=num;
                a.href="javascript:void(0);";
                a.className="page";
                if(num==curpage){
                    a.className="page cur";
                }
                dom.appendChild(a);
              }
            }
            if(curpage<totalpage){
              var a=document.createElement('a');
              a.className="page next f-bg";
              a.innerText="";
              dom.appendChild(a);

            }
            this._initEvent(curpage,totalpage);
        },
        /**
         * 初始化事件
         * @return {[type]} [description]
         */
        _initEvent:function(curpage,totalpage){
            var _self=this;//pager对象本地化
            var _dom=this._options.dom;
            if(!!_dom){
                var doms=_dom.querySelectorAll("#"+this._options.domID+" a")
                for(var i=0,len=doms.length;i<len;i++){
                    var num=Number(doms[i].innerText);
                    if(!!num && num!=_self._options.curpage){
                        doms[i].addEventListener('click',function(num){
                        	return function(){
                        		//console.log(this);//this显示为dom
                                _self._gotoPage(num);
                        	}
                        }(num));

                        //方式2
    //                    (function (num){
    //                    	doms[i].addEventListener('click',function(){
    //                    		_self._gotoPage(num);
    //                    	})
    //                    })(num);
                    }
                }
                var map={
                    'prev':_self._options.curpage-1,
                    'next':_self._options.curpage+1
                    }
                for(var s in map){
                    var dom=_dom.querySelector("."+s);
                    if(!!dom){
                        dom.addEventListener('click',function(s){
                        	return function(){
                        		_self._gotoPage(map[s]);
                        	}
                        }(s))
                    }
                }

            }


        },
        /**
         * 页面跳转
         * @return {[type]} [description]
         */
        _gotoPage:function(num){
            var _self=this;
            this._options.curpage=num;
            console.log(num);
            _self._request(this._options);
        }


    };






window.pager=pager;

})();
