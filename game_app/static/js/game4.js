var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

cancelAnimationFrame(animation);


function startGame() {
    frameRun();
}

function restartGame() {
    ball.y = 300;
    ball.height = 45;
    cactuses = [];
    timer = 0;
    jumpTimer = 0;
    frameRun();
}


var ball = {
    //ball 캐릭터 정보 미리 object자료로 정리
    x: 10,
    y: 300,
    width: 45,
    height: 45,
    draw() {
        //네모 그리기  
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//장애물 object
class Cactus {
    constructor() {
        this.x = 500;
        this.y = Math.random() * 401;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var timer = 0;
//장애물이 여러개이기에 array로 담아주기
var cactuses = [];
var jumpTimer = 0;
var animation;

function frameRun() {
    animation = requestAnimationFrame(frameRun); //웹브라우저 기본 기능(1초에 60번 이 기능이 동작)
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timer % 300 === 0) {
        //120프레임마다 한 번씩 장애물 그려주기
        var cactus = new Cactus();
        cactuses.push(cactus);
    }
    //array 안에 있던 거 꺼내서 draw하는 반복문
    cactuses.forEach((a, i, o) => {
        //x좌표가 0미만이면 제거
        if (a.x < 0) {
            o.splice(i, 1)
        }
        a.x -= 2; //1초에 120px만큼 이동

        crash(ball, a);

        a.draw();
    })
    //space 누를 때마다 점프 기능
    if (jumping == true) {
        ball.y -= 3; //1초에 2점프
        jumpTimer++;
    }
    if (jumping == false) {
        if (ball.y < 300) {
            ball.y++;
        }
    }
    if (jumpTimer > 30) {
        jumping = false;
        jumpTimer = 0;
    }
    ball.draw()
}

var jumping = false;

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        jumping = true;
    }
})
//충돌확인
function crash(ball, cactus) {
    var xDifference = cactus.x - (ball.x + ball.width);
    var yDifference = cactus.y - (ball.y + ball.height);
    var yDifference2 = ball.y - (cactus.y + cactus.height);
    if (ball.y < cactus.y) {
        if (xDifference < 0 && yDifference < 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // alert('Game Over!');
            cancelAnimationFrame(animation) //animation 중단 

        }
        if (ball.y > cactus.y) {
            if (xDifference < 0 && yDifference2 < 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                 alert('Game Over! Your score: ');
                cancelAnimationFrame(animation) //animation 중단 

            }
        }
    }
}
