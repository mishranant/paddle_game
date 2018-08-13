let ball, paddle, brick, addspeed = 0, currscore = 0;
const pi = Math.PI;
const phi = (1 + Math.sqrt(5))/2;
let canvas = document.getElementById('gameplay');
let ctx = canvas.getContext('2d');
let bricks = [];

ball = {
	x:300,
	y:200,
	r:14,
	velocity_x: 3,
	velocity_y:-3
}

brick = {
	x:0,
	y:220,
	width:0,
	height:14,
	gapbw:20,
	gaptop:40,
	gapLR:60,
	col:6,
	row:4	
}

paddle = {
	x:0,
	y:0,
	width:140,
	height:15
}

brick.width = (canvas.width - 2*brick.gapLR - (brick.col-1)*brick.gapbw)/brick.col;
paddle.y = canvas.height - 2*paddle.height;
paddle.x = Math.floor((canvas.width - paddle.width)/2);

for (let r = 0; r < brick.row; r++) {
	bricks[r] = [];
	for (let c = 0; c < brick.col; c++) {
		bricks[r][c] = {
			x: brick.gapLR + c*(brick.width + brick.gapbw),
			y: brick.gaptop + r*(brick.height + 8),
			score: 10*(brick.row-r)
		}
	}
}

function newGame(){
	currscore = 0;
	addspeed = 0;
	for (let r = 0; r < brick.row; r++) {
		bricks[r] = [];
		for (let c = 0; c < brick.col; c++) {
			bricks[r][c] = {
				x: brick.gapLR + c*(brick.width + brick.gapbw),
				y: brick.gaptop + r*(brick.height + 8),
			}
		}
	}
	ball.x = ball.r + Math.floor((canvas.width - ball.r) * Math.random());
	ball.y = bricks[brick.row-1][brick.col-1].y + 2*brick.height;
	paddle.x = Math.floor((canvas.width - paddle.width)/2);
	ball.velocity_y = Math.abs(ball.velocity_y);
}

/*ball.velocity_x *= (Math.floor(6 * Math.random()) % 2) ? -1 : 1;
ball.velocity_y *= (Math.floor(6 * Math.random()) % 2) ? -1 : 1;
*/
const hit = document.getElementById("hit-sound");
hit.style.display ="none";

function initGame(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();	 
	collisionDetection();
	ball.x += ball.velocity_x;
	ball.x += (ball.velocity_x > 0) ? addspeed : -addspeed;
	ball.y += ball.velocity_y;
	ball.y += (ball.velocity_y > 0) ? addspeed : -addspeed;
	if ((ball.x > (paddle.x + paddle.width) || ball.x < paddle.x) && ball.y > paddle.y){
		alert('Game Over');
		newGame();
	}
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.r, 0, 2*pi);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.fillStyle = "black";	
	ctx.fill();
	ctx.closePath();
}
document.onkeydown = function movePaddle(e){
	let key = e.keyCode || e.which;
//37 left, 38 up, 39 right, 40 down
if (key == 37 && paddle.x > 0)
	paddle.x -= (12 + addspeed);
if (key == 39 && paddle.x + paddle.width < canvas.width)
	paddle.x += (12 + addspeed);
}

function collisionDetection(){			
	if (ball.x <= ball.r || ball.x + ball.r >= canvas.width)
		ball.velocity_x = -ball.velocity_x;

	if (ball.y <= ball.r)
		ball.velocity_y = -ball.velocity_y;

	if (paddle.y - ball.y <= ball.r && ball.x <= paddle.x + paddle.width + ball.r && ball.x >= paddle.x - ball.r && ball.velocity_y > 0){
		ball.velocity_y = -ball.velocity_y;
		hit.play();
	}
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.col; c++) {
			if (bricks[r][c].x - ball.r <= ball.x && ball.x <= ball.r + bricks[r][c].x + brick.width && bricks[r][c].y <= ball.y && ball.y <= bricks[r][c].y + brick.height){
				bricks[r][c].x = canvas.width;
				bricks[r][c].y = canvas.height;
				ball.velocity_x = -ball.velocity_x;
				currscore += bricks[r][c].score;
				addspeed++;
			}
			if (bricks[r][c].y - ball.r <= ball.y && ball.y <= ball.r + bricks[r][c].y + brick.height && bricks[r][c].x <= ball.x && ball.x <= bricks[r][c].x + brick.width){
				bricks[r][c].x = canvas.width;
				bricks[r][c].y = canvas.height;
				ball.velocity_y = -ball.velocity_y;
				currscore += bricks[r][c].score;
				addspeed++;
			}
		}
	}
}

function drawBricks(){
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.col; c++) {
			ctx.beginPath();
			ctx.rect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();			
		}
	}
}
setInterval(initGame, 15);