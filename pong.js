const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
canvas.addEventListener("mousemove",movePaddle);
canvas.addEventListener("click",pauseGame);
const restart = document.getElementById("new-game");
restart.addEventListener("click", restartGame);

let loop, playing = false;

const framePerSecond = 50;

const user = {
    x: 0,
    y: canvas.height/2 - (100/2),
    width: 15,
    height: 100,
    color: "white",
    score: 0
}

const com = {
    x: canvas.width - 15,
    y: canvas.height/2 - (100/2),
    width: 15,
    height: 100,
    color: "white",
    score: 0
}

const net = {
    x: canvas.width/2-1,
    y: 0,
    width: 2,
    height: 10,
    color: "white",
    score: 0
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    speed: 6,
    vx: 6,
    vy: 6,
    r: 10,
    color: "white"
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i += 15){
        drawRect(net.x,net.y + i,net.width,net.height,net.color);
    }
}

function drawCircle(x,y,r,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,false);
    context.closePath();
    context.fill();
}

function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}

function drawText(text,x,y,color){
    context.fillStyle = color;
    context.font = "75px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text,x,y);
}

function render(){
    drawRect(0,0,600,400,"black");
    drawText(user.score,canvas.width/4,canvas.height/5,"white");
    drawText(com.score,3*canvas.width/4,canvas.height/5,"white");
    drawNet();
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(com.x,com.y,com.width,com.height,com.color);
    drawCircle(ball.x,ball.y,ball.r,ball.color);
}

function welcome(){
    drawRect(0,0,600,400,"black");
    drawText(user.score,canvas.width/4,canvas.height/5,"white");
    drawText(com.score,3*canvas.width/4,canvas.height/5,"white");
    drawNet();
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(com.x,com.y,com.width,com.height,com.color);
    
    drawText("Start",canvas.width/2,canvas.height/2,"white");

}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x +b.r;

    return b.bottom > p.top && b.top < p.bottom && b.left < p.right && b.right > p.left;
}

function resetBall(){
    ball.speed = 6;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = -ball.vx;
}

function update(){
    ball.x += ball.vx;
    ball.y += ball.vy;

    let computerLevel = 0.08
    com.y += (ball.y - (com.y+com.height/2)) * computerLevel

    if(ball.y+ball.r>canvas.height || ball.y-ball.r<0 ){
            ball.vy = -ball.vy;
        };
    let player = (ball.x < canvas.width/2) ? user : com;
    if(collision(ball,player)){
        let collidePoint = (ball.y-(player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        
        ball.vx = direction * ball.speed * Math.cos(angleRad);
        ball.vy = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }
    if(ball.x - ball.r < 0){
        com.score ++;
        resetBall();
    } else if(ball.x + ball.r > canvas.width){
        user.score ++;
        resetBall();
    }
}

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2
}

function game(){
    render();
    update();
}

function startGame(){
loop = setInterval(game, 1000/framePerSecond);
playing = true;
}

function pauseGame(){
    if(playing){
    clearInterval(loop);
    playing = false;
    } else {
        startGame()
    }
}

function restartGame(){
    clearInterval(loop);
    user.score = 0;
    com.score = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.width/2;
    ball.speed = 6;
    ball.vx = 6;
    ball.vy = 6;
    user.y = canvas.height/2 - (100/2),
    com.y = canvas.height/2 - (100/2),
    playing = false;
    welcome();
}

welcome();

