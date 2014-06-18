var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = document.body.clientWidth;
canvas.height = 200;

document.body.appendChild(canvas);

var x = 0, y,
    barWidth = 2;

function coeff(){
    return Math.random() > 0.5 ? 1 : -1;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function drawRect(x, y){
    var rX = x-1,
        rY = Math.floor(y+coeff()*rand(0, 10)),
        rW = 2,
        rH = rand(3, 25);
    ctx.beginPath();
    ctx.rect(rX, rY, rW, rH);
    if(coeff()>0){
        ctx.fillStyle = '#FFF';
        ctx.fill();
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FFF';
    ctx.stroke();

    ctx.moveTo(rX+1, rY);
    ctx.lineTo(rX+1, rY-rand(0, 10));
    ctx.moveTo(rX+1, rY+rH);
    ctx.lineTo(rX+1, rY+rH+rand(0, 10));
    ctx.stroke();
    ctx.closePath();
}

function generateBars(){
    ctx.globalAlpha = 0.2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while(x <= canvas.width){
        y = Math.sin(x*Math.PI/180)*40+100+(Math.sin(x*4*Math.PI/180)*20);
        drawRect(x, y);
        x += 5;
    }
}

generateBars();

window.addEventListener('resize', function(){
    canvas.width = document.body.clientWidth;
    canvas.height = 200;
    generateBars();
}. false);