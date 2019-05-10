var lev = 100;
var num = 30;
var direction = 3;
var handle;
var score = 0;
var pause = true;
var canvas = document.getElementById('plank');
var context = canvas.getContext('2d');
var snakex = new Array();
var snakey = new Array();
var prize = new Array(-1, -1);
function rand() {
    return parseInt(Math.random() * num);
}
function chk(x, y) {
    if (x < 0 || y < 0) return false;
    if (x > num - 1 || y > num - 1) return false;
    for (var i = 0; i != snakex.length - 1; i++) {
        if (snakex[i] == x && snakey[i] == y) { return false; }
    };
    return true;
}
function drawScore(text) {
    context.clearRect(0, 0, 300, 25);
    context.fillText("Score:" + text, 5, 5);
}
function makeprize() {
    var flag = false;
    var prizepre = new Array(2);
    while (!flag) {
        flag = true;
        prizepre[0] = rand(); prizepre[1] = rand();
        for (var i = 0; i != snakex.length; i++) {
            if ((snakex[i] == prizepre[0]) && (snakey[i] == prizepre[1])) { flag = false; }
        }
    }
    prize = prizepre;
}
function runscore(x, y) {
    if (prize[0] == x && prize[1] == y) {
        score = score + 1;
        drawScore(score);
        snakex[snakex.length] = prize[0];
        snakey[snakey.length] = prize[1];
        makeprize();
        drawNode(prize[0], prize[1]);
        return true;
    }
    return false;
}
function run() {
    switch (direction) {
        case 0: snakex[snakex.length] = snakex[snakex.length - 1]; snakey[snakey.length] = snakey[snakey.length - 1] - 1; break;
        case 1: snakex[snakex.length] = snakex[snakex.length - 1]; snakey[snakey.length] = snakey[snakey.length - 1] + 1; break;
        case 2: snakex[snakex.length] = snakex[snakex.length - 1] - 1; snakey[snakey.length] = snakey[snakey.length - 1]; break;
        case 3: snakex[snakex.length] = snakex[snakex.length - 1] + 1; snakey[snakey.length] = snakey[snakey.length - 1]; break;
    }
    if (!runscore(snakex[snakex.length - 1], snakey[snakey.length - 1])) {
        if (chk(snakex[snakex.length - 1], snakey[snakey.length - 1]) == false) {
            clearInterval(handle);
            drawScore('\tGame over');
            return;
        }
        drawNode(snakex[snakex.length - 1], snakey[snakey.length - 1]);
    }
    clearNode(snakex[0], snakey[0]);
    snakex.shift();
    snakey.shift();
}
function drawNode(x, y) {
    context.fillRect(x * 10 + 1, y * 10 + 31, 10, 10);
}
function clearNode(x, y) {
    context.clearRect(x * 10 + 1, y * 10 + 31, 10, 10);
}
function init() {
    canvas.width = 510;
    canvas.height = 600;
    context.font = "normal 20px Airl";
    context.textBaseline = "top";
    context.fillText('snake', 0, 350);
    drawScore('');
    context.strokeRect(0, 30, 302, 302);
    makeprize();
    drawNode(prize[0], prize[1]);
    snakex[0] = 0; snakex[1] = 1; snakex[2] = 2;
    snakey[0] = 0; snakey[1] = 0; snakey[2] = 0;
    drawNode(snakex[0], snakey[0]); drawNode(snakex[1], snakey[1]); drawNode(snakex[2], snakey[2]);
}
document.onkeydown = function (event) {
    var e = event || window.event;
    if (e && e.keyCode == 38) {
        direction = 0;
    }
    if (e && e.keyCode == 40) {
        direction = 1;
    }
    if (e && e.keyCode == 37) {
        direction = 2;
    }
    if (e && e.keyCode == 39) {
        direction = 3;
    }
    if (e && e.keyCode == 80) {
        if (pause) { pause = false; handle = setInterval(run, lev); }
        else { pause = true; clearInterval(handle); }
    }
}
init();