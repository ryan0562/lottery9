$(function() {
    var lottery = {
        place: 0, //请求后指定停留在某个位置
        click: false, //默认值为false可抽奖，防止重复点击
        index: -1, //当前转动到哪个位置，起点位置
        count: 0, //总共有多少个位置
        timer: 0, //setTimeout的ID，用clearTimeout清除
        speed: 20, //初始转动速度
        times: 0, //转动次数
        cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize: -1, //中奖位置
        init: function(id) {
            if ($("#" + id).find(".lottery-unit").length > 0) {
                $lottery = $("#" + id);
                $units = $lottery.find(".lottery-unit");
                this.obj = $lottery;
                this.count = $units.length;
                $lottery.find(".lottery-unit-" + this.index).addClass("active");
            };
        },
        roll: function() {
            var index = this.index,
                count = this.count,
                lottery = this.obj;
            $(lottery).find(".lottery-unit-" + index).removeClass("active");
            index += 1;
            if (index > count - 1) {
                index = 0;
            };
            $(lottery).find(".lottery-unit-" + index).addClass("active");
            this.index = index;
            return false;
        },
        stop: function() {
            lottery.times += 1;
            lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化
            if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                clearTimeout(lottery.timer);
                lottery.prize = -1;
                lottery.times = 0;
                lottery.click = false;
                //可以在这个位置写上中奖弹框，这个是转盘停止时触发事件
                console.log('您抽中了第' + lottery.place + '个奖品');
            } else {
                if (lottery.times < lottery.cycle) {
                    lottery.speed -= 10;
                } else if (lottery.times == lottery.cycle) {
                    lottery.prize = lottery.place; //这个可以通过ajax请求回来的数据赋值给lottery.place    
                } else {
                    if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                        lottery.speed += 110;
                    } else {
                        lottery.speed += 20;
                    }
                }
                if (lottery.speed < 40) {
                    lottery.speed = 40;
                };
                lottery.timer = setTimeout(lottery.stop, lottery.speed); //循环调用
            }
            return false;
        },
        getLottery: function() { //ajax请求中奖接口，本案例注释便于案例正常展示效果，实际中可参考注释的代码
            var data = [0, 1, 2, 3, 4, 5, 6, 7]; //抽奖
            //data为随机出来的结果，根据概率后的结果
            data = data[Math.floor(Math.random() * data.length)]; //1~8的随机数
            console.log(data)
            switch (data) { //请求返回的抽中奖品字段
                case 0: //0.2加息券
                    lottery.place = 0; //当前奖品所在九宫格位置
                    break;
                case 1: //10元投资红包
                    lottery.place = 1; //当前奖品所在九宫格位置
                    break;
                case 2: //500积分
                    lottery.place = 2; //当前奖品所在九宫格位置
                    break;
                case 3: //10元话费
                    lottery.place = 3; //当前奖品所在九宫格位置
                    break;
                case 4: //100元京东卡
                    lottery.place = 4; //当前奖品所在九宫格位置
                    break;
                case 5: //3000积分
                    lottery.place = 5; //当前奖品所在九宫格位置
                    break;
                case 6: //0.5加息券
                    lottery.place = 6; //当前奖品所在九宫格位置
                    break;
                case 7: //50元投资红包
                    lottery.place = 7; //当前奖品所在九宫格位置
                    break;
            }
            lottery.speed = 100;
            lottery.stop(); //转圈过程不响应click事件，会将click置为false
            lottery.click = true; //一次抽奖完成后，设置click为true，可继续抽奖
        }
    };

    $("#lottery .btn").on('click', function(event) {
        event.preventDefault();
        lottery.init('lottery');
        if (lottery.click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;
        } else {
            lottery.getLottery();
            return false;
        }
    });
});