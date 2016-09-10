//回到顶部
;(function(){
    var backTop= document.getElementById('backTop');
    backTop.onclick = function(){
        window.clearInterval(backTop.timer);
        this.style.display = 'none';
        backTop.timer = window.setInterval(function(){
            var curST = utils.win('scrollTop');
            window.onscroll = null;
            var speed = curST/1000*10;
            if(curST<=0){
                window.clearInterval(backTop.timer);
                utils.win('scrollTop',0);
                window.onscroll = scroll;
                return;
            }
            curST -= speed;
            utils.win('scrollTop',curST);
        },10)
    };
    window.addEventListener('scroll', scroll, false);
    function scroll(){
        var curST = utils.win('scrollTop');
        var curScreen = utils.win('clientHeight');
        if(curST>curScreen){
            backTop.style.display = 'block';
        }else{
            backTop.style.display = 'none'
        }
    }

})();
//固定定位
(function () {
    var loginToolBar = document.getElementById("loginToolBar"),
        backTop = document.getElementById("backTop"),
        feedBack = document.getElementById("feedback-icon"),
        footer = document.getElementById("footer");

    function changeFooter() {
        var direction = utils.win("scrollTop") + utils.win("clientHeight") - utils.offset(footer).top;
        var backTopB = footer.offsetHeight + feedBack.offsetHeight + 12 + 10;
        var feedBackB = footer.offsetHeight + 12;
        if (direction >= 0) {
            utils.css(loginToolBar, {
                position: "fixed",
                bottom: 100+'px'
            });
            utils.css(backTop, {
                position: "fixed",
                bottom: backTopB + 100+'px'
            });
            utils.css(feedBack, {
                position: "fixed",
                bottom: feedBackB + 100+'px'
            });
        } else {
            utils.css(loginToolBar, {
                position: "fixed",
                bottom: 0
            });
            utils.css(backTop, {
                position: "fixed",
                bottom: backTopB
            });
            utils.css(feedBack, {
                position: "fixed",
                bottom: feedBackB
            });
        }
    }

    window.addEventListener('scroll', changeFooter, false);
})();

//选项卡
;(function(){
    var wap = document.getElementById('wap');
    var jobTab = document.getElementById('jobTab');
    var lis = jobTab.getElementsByTagName('li');
    var jobLIst = wap.getElementsByClassName('jobList');
    //console.log(jobLIst)
    for(var i = 0;i<lis.length;i++){
        lis[i].index = i;
        lis[i].onclick = function(){
            for(var j = 0;j<lis.length;j++){
                lis[j].className = '';
                jobLIst[j].style.display = 'none';
            }
            this.className = 'selector';
            jobLIst[this.index].style.display ='block';
        }
    }
})()

//轮播图
;(function () {
    var homeBanner = document.getElementById("homeBanner"),
        banner = homeBanner.getElementsByClassName( 'banner')[0],
        banner_bg = banner.getElementsByClassName("banner_bg")[0],
        lis = banner_bg.getElementsByTagName('li'),
        imgList = banner_bg.getElementsByTagName('img'),
        banner_control = homeBanner.getElementsByClassName('banner_control')[0],
        em =banner_control.getElementsByTagName('em')[0],
        ul = banner_control.getElementsByClassName('thumbs')[0],
        oLis = ul.getElementsByTagName('li');
    //console.log( ul)

    //获取数据
    ;(function () {
        ajax({
            url: "json/data1.txt",
            async: true,
            success: function (data) {
                //console.log(data);
                var str1 = '';
                for (var i = 0; i < data.length; i++) {
                    var curData1 = data[i];
                    str1 += '<li><a href="javascript:void 0"><img src="" trueSrc="' + curData1.src + '"/></a></li>';

                }
                str1 += '<li><a href="javascript:void 0"><img src="" trueSrc="' + data[0].src + '"/></a></li>';
                banner_bg.style.height = (data.length)*160+'px';
                banner_bg.innerHTML = str1;
            }
        });
    })();

    //图片延迟加载
    function lazyImg() {
        for (var i = 0; i < imgList.length; i++) {
            ~function (i) {
                var curImg = imgList[i];
                var tempImg = new Image;
                var trueSrc = curImg.getAttribute("trueSrc");
                tempImg.src = trueSrc;
                tempImg.onload = function () {
                    curImg.src = this.src;
                    utils.css(curImg, 'display', "block");
                    zhufengAnimate(curImg, {opacity: 1}, 500);
                    tempImg = null;
                }
            }(i)
        }
    }

    window.setTimeout(lazyImg, 500);

    var step = 0, autoTimer = null;
    autoTimer = window.setInterval(autoMove, 3000);
    function autoMove() {
        if (step >= imgList.length-1 ) {
            step = 0;
            utils.css(banner_bg, "top", -step * 160);
        }
        step++;
        window.zhufengAnimate(banner_bg, {top: -step * 160}, 500);
        changeTip();
    }

    function changeTip() {
        var tempStep = step >= imgList.length-1 ? 0 : step;
        for (var i = 0; i < oLis.length; i++) {
            var cur = oLis[i];
            //console.log(oLis)
            cur.index = i;
            if (i == tempStep) {
                ~function (i) {
                    zhufengAnimate(em, {top: i * 55}, 110, function () {
                        var shadow = utils.firstChild(oLis[i]);
                        utils.removeClass(shadow, "current");
                        var parP = shadow.parentNode;
                        var sibNode = utils.siblings(parP);
                        for (var k = 0; k < sibNode.length; k++) {
                            var curNode = sibNode[k];
                            var fir = utils.firstChild(curNode);
                            utils.addClass(fir, "current")
                        }
                    })
                }(i)
            }
        }
    }

    for (var k = 0; k < oLis.length; k++) {
        var cur = oLis[k];
        cur.index = k;
        cur.onmouseenter = function () {
            window.clearInterval(autoTimer);
            autoTimer = null;
            step = this.index;
            zhufengAnimate(banner_bg, {top: -step * 160}, 500);
            changeTip();
        };
        cur.onmouseleave = function () {
            autoTimer = window.setInterval(autoMove, 3000);
        }
    }
})();

//鼠标滑过遮罩层效果
;(function () {
    var da_thumbs = document.getElementById('da_thumbs');
    var oLis = da_thumbs.getElementsByTagName("li");
    //console.log(imgList)
    for (var i = 0; i < oLis.length; i++) {
        var curLi = oLis[i];
        curLi.onmouseenter = function (e) {
            var height = this.clientHeight,
                width = this.clientWidth,
                curX = e.pageX - utils.offset(this).left,
                curY = height - (e.pageY - utils.offset(this).top);
            var a = utils.children(this, "a")[0];
            if (curY < curX && curY < height - curX && curY > -3) {
                utils.css(a, "top", height);
                utils.css(a, "left", 0);
                window.zhufengAnimate(a, {top: 0}, 300);
            }
            if (curY < curX && curY > height - curX && curX <= width + 3) {
                utils.css(a, {
                    top: 0,
                    left: width
                });
                window.zhufengAnimate(a, {left: 0}, 300);

            }
            if (curY > curX && curY < height - curX && curX > -3) {
                utils.css(a, {
                    top: 0,
                    left: -width
                });
                window.zhufengAnimate(a, {left: 0}, 300);

            }
            if (curY > height - curX && curY > curX && curY <= height + 3) {
                utils.css(a, {
                    top: -height,
                    left: 0
                });
                window.zhufengAnimate(a, {top: 0}, 300);
            }
        };

        curLi.onmouseleave = function (e) {
            var height = this.clientHeight, width = this.clientWidth;
            var curY = height - (e.pageY - utils.offset(this).top);
            var curX = e.pageX - utils.offset(this).left;
            var a = utils.children(this, "a")[0];
            if (curY <= 0) {
                window.zhufengAnimate(a, {top: height}, 300);
            }
            if (curY >= height) {
                window.zhufengAnimate(a, {top: -height}, 300);
            }
            if (curX >= width) {
                window.zhufengAnimate(a, {left: width}, 300);
            }
            if (curX <= 0) {
                window.zhufengAnimate(a, {left: -width}, 300);
            }
        }
    }
})();
