/******************************* ngLite Version 0.0.1  *******************************/
/*                      Created By Jessel John on 17-Jan-2015                        */
/*                              Updated 13-Apr-2015                                  */
/*************************************************************************************/
(function (Sizzle) {
    var ngSelector = function (params) {
        return new attachs(params);
    },scrollTo = function(element, to, duration) {
        if (duration < 0) return;
        var difference = to - element.scrollTop,
            perTick = difference / (duration||(function(){element.isScrolling = false;return 0.5;})()) * 10;

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick
            if (element.scrollTop == to || element.scrollTop >= (element.scrollHeight - element.offsetHeight)){
                element.isScrolling = false;
                return;
            }
            scrollTo(element, to, duration - 10);
      }, 10);
    };


    var attachs = function (params) {
        var selector = Sizzle(params),
            i = 0;
        this.length = selector.length;
        this.version = '0.0.1';
        if(typeof params === 'string'){
            for (; i < this.length; i++) {
                this[i] = selector[i];
            }
        }else{
            this[0] = params;
            this.length = 1;
        }
        return this;
    };

    ngSelector.fn = attachs.prototype =
    {
        loopAndApplyStyle:function(styl,val){
            var len = this.length;
            while (len--) {
                this[len].style[styl] = val;
            }
        },
        loopObjectAndApplyStyle:function(obj){
            var len = this.length;
            while (len--){
                for(var a in obj){
                    this[len].style[a] = obj[a];
                }
            }
        },
        addingListenersLoop:function(){
            var len = this.length;
            while (len--) {
                this[len].addEventListener(arguments[0],arguments[1],false);
            }
        },


        hide: function () {
            this.loopAndApplyStyle('display','none');
        },
        show: function () {
            this.loopAndApplyStyle('display','none');
        },
        css: function(){
            if(arguments[1]){
                this.loopAndApplyStyle(arguments[0],arguments[1]);
            }
            else{
                this.loopObjectAndApplyStyle(arguments[0]);
            }
            return this;
        },
        attr:function(){
            return this[0].getAttribute(arguments[0]);
        },
        find:function(){
            var childElems = [];
            for(var a in this[0].childNodes){
                if(this[0].childNodes[a].nodeType === 1 && this.hasClass.call(ngSelector(this[0].childNodes[a]),arguments[0].substr(1))){
                    if(!arguments[1]){
                        return ngSelector(this[0].childNodes[a]);
                    }
                    else{
                        ngSelector(this[0].childNodes[a])[arguments[1]](arguments[2]);
                    }
                }
                childElems.push(this[0].childNodes[a]);
            }

            for(var i=0;i<childElems.length;i++){
                try{
                    if(childElems[i].nodeType === 1 && this.hasClass.call(ngSelector(childElems[i]),arguments[0].substr(1))){
                        if(!arguments[1]){
                            return ngSelector(childElems[i]);
                        }
                        else{
                            ngSelector(childElems[i])[arguments[1]](arguments[2]);
                        }
                    }
                    if(childElems[i].childNodes.length > 0){
                        for(var j=0,len = childElems[i].childNodes.length;j<len;j++){
                            if(childElems[i].childNodes[j].nodeType === 1){
                                childElems.push(childElems[i].childNodes[j]);
                            }
                        }
                    }
                }catch(err){}
            }
        },
        closest:function(){
            var parentElem = this[0],
                bool = false;
            try{
                while(!bool){
                    parentElem = parentElem.parentNode;
                    bool = this.hasClass.call(ngSelector(parentElem),arguments[0].substr(1));
                }
                return ngSelector(parentElem);
            }catch(err){}
        },
        hasClass:function(){
            try{
                return this[0].getAttribute('class').split(" ").indexOf(arguments[0]) >= 0;
            }catch(err){}
        },
        addClass:function(){
            var len = this.length;
            while (len--) {
                if(this[len].getAttribute('class').split(" ").indexOf(arguments[0]) <=0){
                    this[len].className =  this[len].className + " " + arguments[0];
                }
            }
        },
        removeClass: function(){
            var r = new RegExp("(?:^| )(" + arguments[0] + ")(?:| )"),
                len = this.length;
            while (len--) {
                this[len].className = this[len].className.replace(r,'').replace(/\s{2,}/g, ' ');
            }
        },
        on: function(event){
            var len = this.length,
                args = arguments;
            while (len--) {
                var currentElem = this[len];
                currentElem.addEventListener(args[0],function(event){
                    try{
                        var elemsArr = args[1].split(','),
                            targElem = ngSelector(event.target),
                            targElemDom = targElem[0],
                            callback = args[2];
                        for(var i=0,len = elemsArr.length;i<len;i++){
                            var foundElem = targElem.closest(elemsArr[i]),
                                elementSubStr = elemsArr[i].substr(1),
                                isItTarget = targElem.hasClass(elementSubStr);
                            try{
                                if(ngSelector(this).find(elemsArr[i]).hasClass(elementSubStr) && (isItTarget || foundElem.hasClass(elementSubStr))){
                                    callback.currentClassName = elemsArr[i];
                                    callback.call(isItTarget?targElemDom:foundElem[0]);
                                    break;
                                }
                            }catch(err){}
                        }
                    }catch(err){}
                },false);
            }
        },
        animateScroll: function(scrolldir,scrollLimit){
            var that = this,
                len = that.length;
            while(len--){
                var elem = that[len];
                elem.isScrolling = true;
                scrollTo(that[len],scrollLimit,300);
            }

            // var that = this,
            //     dir,
            //     cycle = function (){
            //       var len = that.length,
            //         flag = 0;
            //       while(len--){
            //         var currentElem = that[len],
            //           scrollVal = currentElem[scrolldir];
            //         if(dir===undefined){
            //           dir = scrollVal<scrollLimit?1:-1;
            //         }
            //         if(scrollVal <= scrollLimit && scrollVal<currentElem.scrollHeight - window.innerHeight && dir===1){
            //           currentElem[scrolldir] += 10;
            //           flag = 1;
            //         }
            //         else if(scrollVal >= scrollLimit && dir===-1){
            //           currentElem[scrolldir] -= 10;
            //           flag = 1;
            //         }
            //       }
            //       if(flag === 1){
            //         setTimeout(arguments.callee,10);
            //       }
            //     };

            // cycle();
        }
    };

    var domListenerArr = ['click','mouseup','mousedown','mousemove','mouseover','mouseout','keydown','keypress'];
    for(var i=0,len=domListenerArr.length;i<len;i++){
        var thisHandler = domListenerArr[i];
        (function(i){
            ngSelector.fn[thisHandler] = attachs.prototype[thisHandler] = function(){
                this.addingListenersLoop(domListenerArr[i],arguments[0]);
            }
        })(i);
    }

    if(!window.ngSelector) {
        window.ngSelector = ngSelector;
    }
})(Sizzle);