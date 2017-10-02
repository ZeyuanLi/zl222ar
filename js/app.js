
window.onload = function() {
    var start = document.getElementById('j_start');
    var reset = document.getElementById('j_reset');
    var name = document.getElementById('j_name');
    var questionsBox = document.getElementById('question-box');
    var timer1 = null;
    var val_1 = '';
    var num = 0;
    var timerBox;
    var arr = [];
    var nick;
    start.onclick = function() {
        var classname = this.getAttribute('class');
        if(classname == 'disabled') {
          return;
        }
        val_1 = document.getElementById('nick').value;
        nick = document.getElementById('j_nick_box');
        if (val_1 == '') {
            alert('Please enter a nickname');
            return false;
        }
        nick.innerHTML = 'Hello,  ' + val_1;
        name.style.display = 'none';
        timer();
        run("http://vhost3.lnu.se:20080/question/1");
        this.setAttribute('class', 'disabled');
    }
    reset.onclick = function() {
        location.reload();
    }
    // timer
    function timer() {
        var time = 20;
        timerBox = document.getElementById('j_timer');
        timerBox.innerHTML = time + ' s';
        timer1 = setInterval(function() {
            time--;
            if (time < 10) {
                time = '0' + time;
            }
            timerBox.innerHTML = time + ' s';
            if (time == 0) {
                clearInterval(timer);
                error();
            }
        }, 1000);
    }
    // run
    function run(url) {
        clearInterval(timer1);
        timer();
        var box = document.getElementById('inner');
        var submit = document.getElementById('j_submit');
        var answer = document.getElementById('answer');
        ajax({
            type: "GET",
            url: url,
            dataType: "json",
            data: {},
            beforeSend: function() {
                box.innerHTML = 'loading...';
            },
            success: function(msg) {
                console.log(msg);
                box.innerHTML = msg.question;
                questionsBox.style.display = 'block';
                // submit
                submit.onclick = function() {
                    nick.value = '';
                    var val = answer.value;
                    if (val == '') {
                        alert('Please enter the answer');
                        return;
                    }
                    ajax({
                        type: "POST",
                        url: msg.nextURL,
                        dataType: "json",
                        data: {
                            'answer': parseInt(val)
                        },
                        beforeSend: function() {
                            //some js code 
                        },
                        success: function(msg) {
                            console.log(msg);
                            if (msg.message == 'Correct answer!') {

                                num += 20 - parseInt(timerBox.innerHTML);
                                console.log(num);
                                var obj = {};
                                var arr = [];
                                obj.name = val_1;
                                obj.num = num;
                                console.log(obj);
                                var list = JSON.parse(localStorage.getItem('arr'));
                                console.log(list)
                                if (list) {
                                    list.push(obj);
                                    localStorage.setItem('arr', JSON.stringify(list));
                                } else {
                                    arr.push(obj);
                                    localStorage.setItem('arr', JSON.stringify(arr));
                                }
                                run(msg.nextURL);
                            } else {
                                error();
                            }
                        },
                        error: function() {
                            console.log("error");
                            error();
                        }
                    });
                }
            },
            error: function() {
                console.log("error")
            }
        });
    }
    // result
    function result() {
        var arr = localStorage.getItem('arr');
        var result = document.getElementById('j_level');
        arr = JSON.parse(arr);
        console.log(arr);
        arr = arr.sort(function(a, b) {
          return(a.num - b.num);
        })
        var str = '';
        for (var i = 0, l = arr.length; i < l; i++) {
            var num = arr[i].num;
            if (num < 10) {
                //num = '0' + num;
            }
            str += '<li><span class="name">' + arr[i].name + '</span>: ' + num + ' s</li>';
        }
        result.innerHTML = str;
    }
    result();
    // error
    function error() {
        questionsBox.innerHTML = 'game over~';
        questionsBox.style.fontSize = '24px';
        clearInterval(timer1);
    }
}