
var score = 0;
var Hscore = 0;
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width  = (window.innerWidth || document.documentElement.clientWidth || document.querySelector('.mscreen').clientWidth);
c.height = (window.innerHeight || document.documentElement.clientHeight || document.querySelector('.mscreen').clientHeight);

var instructions = document.createElement("div");
// instructions.innerHTML += "[up] [down] = accelerate <br> [Left] [Rigth] = rotate";
window.addEventListener('load', function () {
    document.querySelector('.mscreen').appendChild(c);
    document.querySelector('.mscreen').appendChild(instructions);
});

var perm = [];
while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}
var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
var noise = x => {
    x = x * 0.01 % 254;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var Player = function () {
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
    this.img = new Image();
    this.img.src = 'bike1.svg';
    this.draw = function () {
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;

        var grounded = 0;
        if (p1 - 12 > this.y) {
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1 - 12);
            this.y = p1 - 12;
            grounded = 1;
        }

        var angle = Math.atan2((p2 - 12) - this.y, (this.x + 5) - this.x);
        this.y += this.ySpeed;

        if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 5;
        }


        if (grounded && playing) {
            this.rot -= (this.rot - angle) * 0.65;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.1;
        if (this.rot > Math.PI) this.rot = -Math.PI;
        if (this.rot < -Math.PI) this.rot = Math.PI;
        ctx.save();
        ctx.translate(this.x, this.y - 3);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -14, 33, 30);
        ctx.restore();
    }
}

var player = new Player();
var t = 0;
var forward = false;
var speed = 0;
var playing = true;
var k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
function moveNow(move){
    if (move == 'left') {
        if (score <= 0) {
            k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
        } else {
            k = { ArrowUp: 0, ArrowDown: 1, ArrowLeft: 0, ArrowRight: 0 };
        }
        forward = false;
        document.querySelector(".show2").style.animation = 'show1 0.5s linear'
        document.querySelector(".show1").style.animation = 'none'
        document.querySelector(".ml").style.backgroundColor= '#900c3fa1';
    } else if (move == 'right'){
        k = { ArrowUp: 1, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
        forward = true;
        document.querySelector(".show1").style.animation = 'show2 0.5s linear'
        document.querySelector(".show2").style.animation = 'none'
        document.querySelector(".mr").style.backgroundColor= '#900c3fa1';
    }
    if (move == 'tleft') {
        k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 1, ArrowRight: 0 };
    document.querySelector(".tl").style.backgroundColor= '#900c3fa1';
    document.querySelector(".tl").style.boxShadow='0px 0px 30px 15px #900c3f';
} else if (move == 'tright'){
    k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 1 };
    document.querySelector(".tr").style.backgroundColor = '#900c3fa1';
    document.querySelector(".tr").style.boxShadow='0px 0px 30px 15px #900c3f';
}
if (move == 'no') {
    k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
    document.querySelector(".tr").style.boxShadow = document.querySelector(".tl").style.boxShadow = '0px 0px 15px 5px #900c3f';
    document.querySelector(".mr").style.boxShadow = document.querySelector(".ml").style.boxShadow = '0px 0px 15px 5px #900c3f';
    document.querySelector(".tl").style.backgroundColor = document.querySelector(".tr").style.backgroundColor= '#900c3f';
    document.querySelector(".ml").style.backgroundColor = document.querySelector(".mr").style.backgroundColor= '#900c3f';
    }
}

function loop() {
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
    t += 10 * speed;
    ctx.fillStyle = "#ffc300";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#ff5733";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
        ctx.lineTo(i, c.height * 0.8 - noise(t + i * 5) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    ctx.fillStyle = "#C70039";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
    ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();
    if (forward == false) {
        if (score <= 0) {
            score = 0;
        } else {
            score--;
        }
    } else {
        score++;  
    }
    player.draw();
    if (player.x < 0)
    restart();
    requestAnimationFrame(loop);
    var Rscore = Math.floor(score/100)
    if (Rscore > Hscore) {
        Hscore = Rscore;
        document.querySelector('.Hscore').value = 'High Score: '+ Hscore;
    }
    document.querySelector('.score').value = 'Score: '+ Rscore;
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;
function restart() {
    player = new Player();
    t = 0;
    score = 0;
    speed = 0;
    forward = false
    playing = true;
    k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
    
}
loop();