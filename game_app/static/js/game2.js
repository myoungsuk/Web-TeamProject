const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const uninterestedFishColor = "#0B0B61";
const interestedFishColor = "#FF00FF";
const overwaterBobberColor = "#FF0000";
const underwaterBobberColor = "#0000FF";
const bittenBobberColor = "#FFFF00";

/** Navigation-Fish */
class Fish {
    constructor(id, size, normalSpeed, positionX, positionY, goToX, goToY) {
        this.fishId = id;
        this.size = size;
        this.normalSpeed = normalSpeed;
        this.interestedSpeed = 0.5;
        this.speed = this.normalSpeed;
        this.positionX = positionX;
        this.positionY = positionY;
        this.goToX = goToX;
        this.goToY = goToY;
        this.idle = false;
        this.interested = false;
        this.color = uninterestedFishColor;
        this.caught = false;
        console.log("Fish was created.");
    }

    moveThis(x, y) {
        if (this.idle != true) {
            let directX = x - this.positionX;
            let directY = y - this.positionY;

            // directX = 0 and directY = 0 이 되면 안됨.
            if (directX == 0 && directY == 0) {
                directX = 1 / Math.sqrt(2);
                directY = 1 / Math.sqrt(2);
            }

            let a = Math.sqrt((directX * directX + directY * directY))
            let directUnitX = directX / a;
            let directUnitY = directY / a;

            this.positionX += this.speed * directUnitX;
            this.positionY += this.speed * directUnitY;
        }
    }

    drawThis(ctx) {
        // 물고기는 원으로 표현하자
        if (this.caught != true) {
            ctx.beginPath();
            ctx.arc(this.positionX, this.positionY, this.size, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    setSpeed() {
        if (this.interested == true) {
            this.speed = this.interestedSpeed;
        } else {
            this.speed = this.normalSpeed;
        }
    }

    // 미끼에 흥미를 가지게됨
    getInterested() {
        this.interested = true;
        this.color = interestedFishColor;
        this.idle = true;
        gameManager.stats[3] = this.fishId;
        console.log("Fish[" + this.fishId + "] gets interested!");
        setTimeout(() => this.interestedMoveSet(), 2000);      // 2초 기다린 뒤 다시 움직이기
        gameManager.stats[4] = 1;
    }

    // 미끼에 흥미를 뗌
    getUninterested() {
        this.interested = false;
        this.color = uninterestedFishColor;
        gameManager.bobber.bitten = -1;
        gameManager.bobber.color = underwaterBobberColor;
        gameManager.stats[3] = -1;
        this.setSpeed();
    }

    // 미끼에 흥미를 가지는 물고기의 움직임 설정
    interestedMoveSet() {
        this.goToX = gameManager.bobber.positionX;
        this.goToY = gameManager.bobber.positionY;
        this.setSpeed();
        this.idle = false;
    }

    // 미끼를 물지 않고 1초 기다리기
    waitBite() {
        setTimeout(() => this.biteBobber(), 1000);
    }

    // 미끼를 물기
    biteBobber() {
        if (gameManager.bobber.underwater == true) {
            gameManager.bobber.bitten = this.fishId;
            console.log("Fish[" + this.fishId + "] bites the bobber!");
            gameManager.stats[4] = 0;
            setTimeout(() => this.getUninterested(), 500);      // 0.5초만에 낚시를 올리지 않으면 도망감
        }
    }
}


/** Navigation-Bobber */
// 낚시 미끼
class Bobber {
    constructor(speed, size, positionX, positionY) {
        this.speed = speed;
        this.size = size;
        this.positionX = positionX;
        this.positionY = positionY;
        this.bitten = -1;       // 문 물고기의 index. 안물었으면 -1
        this.underwater = false;
        this.color = overwaterBobberColor;
    }

    moveThis(direction) {
        if (this.underwater != true) {
            switch (direction) {
                case 0:     // input 'w'
                    if (this.positionY >= this.size) {
                        this.positionY -= this.speed;
                    }
                    break;
                case 1:     // input 'a'
                    if (this.positionX >= this.size) {
                        this.positionX -= this.speed;
                    }
                    break;
                case 2:     // input 'd'
                    if (this.positionX <= canvas.width - this.size) {
                        this.positionX += this.speed;
                    }
                    break;
                case 3:     // input 's'
                    if (this.positionY <= canvas.height - this.size) {
                        this.positionY += this.speed;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    drawThis(ctx) {
        // 낚시 미끼
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.size, 0, 2 * Math.PI);

        if (this.underwater == true) {
            if (this.bitten == -1) {
                this.color = underwaterBobberColor
            } else {
                this.color = bittenBobberColor;
            }
            ctx.fillStyle = this.color;
        }
        else {
            this.color = overwaterBobberColor
            ctx.fillStyle = this.color;
        }

        ctx.fill();
    }
}


/** Navigation-GameManager */
// 게임 전체 상태를 기억하는 매니저
let gameManager = {
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
    playerScore: 0,
    fishSet: [],        // 물고기들. 낚시에 잡혀도 없어지지 않고, 그 물고기의 caught 필드를 true로 설정해 그것을 비활성화 하는 방식
    bobber: new Bobber(8, 7, canvas.width * 0.5, canvas.height * 0.6),      // 플레이어 낚시 미끼. 싱글톤
    frameCount: 0,
    /*  gameManager.stats - 필요한 게임 세계 상태를 저장하는 플래그들
        0: 게임 시작 했는지 안했는지 (0 / 1)
        1: Fish 마리 수 ( 0 ~ )
        2: bobber가 담겼는지 안담겼는지 (0 / 1)
        3: 어떤 물고기가 bobber에 흥미를 보이는지 안보이는지 (-1 ~ )
        4: 물고기가 흥미를 보이는데 미끼를 물지 않았는지 (0 / 1)
    */
    stats: [0, 0, 0, -1, 0],

    calScore: function() {
        if (!(this.bobber.bitten == -1)) {
            this.fishSet[this.stats[3]].caught = true;
            this.stats[1] -= 1;
            this.playerScore += 1;
        }
    },

    startFishing: function() {
        this.bobber.underwater = true;
        this.stats[2] = 1;

        // 랜덤 물고기가 흥미를 보이기
        let hungryFish
        do {
           hungryFish = Math.floor(Math.random() * this.fishSet.length);
        } while (this.fishSet[hungryFish].caught == true);
        this.fishSet[hungryFish].getInterested();
        this.stats[3] = hungryFish;
    },

    stopFishing: function() {
        this.calScore();
        this.bobber.underwater = false;
        this.stats[2] = 0;
        this.bobber.bitten = -1;

        // 모든 물고기가 흥미를 보이지 않음
        for (let i = 0; i < this.fishSet.length; i++) {
            this.fishSet[i].getUninterested();
        }
        this.stats[3] = -1;
        this.stats[4] = 0;
    }
}

/** Navigation-updateGame */
function updateGame() {

    // 물고기 이동
    for (let i = 0; i < gameManager.fishSet.length; i++) {
        let fish = gameManager.fishSet[i];

        if (fish.interested != true) {
            if (fish.positionX >= (fish.goToX - 5) && (fish.positionX <= (fish.goToX + 5))
            || fish.positionY >= (fish.goToY - 5) && (fish.positionY <= (fish.goToY + 5))) {
                const newX = Math.random() * canvas.width;
                const newY = Math.random() * canvas.height;

                fish.goToX = newX;
                fish.goToY = newY;
            }
        }

        fish.moveThis(fish.goToX, fish.goToY);
    }

    // 물고기가 미끼에 도착했는지 확인
    if ((gameManager.stats[3] != -1) && (
        ((gameManager.fishSet[gameManager.stats[3]].positionX >= gameManager.bobber.positionX - 0.5) &&
        (gameManager.fishSet[gameManager.stats[3]].positionX <= gameManager.bobber.positionX + 0.5)) ||
        (gameManager.fishSet[gameManager.stats[3]].positionY == gameManager.bobber.positionY))) {

        if (gameManager.stats[4] != 0) {
            console.log("Fish arrived");
            gameManager.fishSet[gameManager.stats[3]].waitBite();
            gameManager.stats[4] = 0;
        }
    }
}

/** Navigation-mainLoop */
function mainLoop() {
    updateGame();
    UIManager.drawAll();

    // 약 7.5초 마다 물고기 생성
    //  물고기는 9마리까지 만들기
    if ((gameManager.frameCount = gameManager.frameCount % 450) === 0) {
        if (gameManager.stats[1] <= 9) {
            let fishSize = Math.random() * (15 - 8) + 8;

            gameManager.fishSet.push(
                new Fish(gameManager.fishSet.length,
                    fishSize,
                    Math.random() * (4 - 1.5) + 1.5,            // 평소 속도
                    Math.random() * canvas.width,               // 생성 위치 x
                    Math.random() * canvas.height,              // 생성 위치 y
                    Math.random() * canvas.width,               // 처음 목적지 x
                    Math.random() * canvas.height               // 처음 목적지 y
                    ));
            gameManager.stats[1]++;
        }
    }
    gameManager.frameCount++;

    requestAnimationFrame(mainLoop);
}


/** Navigation - UIManager */
// 모든 객체 그리기 메소드를 호출하는 매니저
let UIManager = {

    drawAll: function () {
        // 화면 비우기
        ctx.clearRect(0, 0, gameManager.canvasWidth, gameManager.canvasHeight);

        // 물고기들 그리기
        for (let i = 0; i < gameManager.fishSet.length; i++) {
            gameManager.fishSet[i].drawThis(ctx);
        }

        // 낚시대 그리기
        const rodTop = this.drawStick();
        this.drawRod(gameManager.bobber, rodTop);
        gameManager.bobber.drawThis(ctx);

        // 점수 표시
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + gameManager.playerScore, 10, 25);
    },

    // 낚시대를 그리는 메소드. 낚시 줄을 그리기 위한 drawRod() 메소드를 위해 낚시대의 끝 위치를 반환
    drawStick: function () {
        let rodWidth = gameManager.canvasWidth * 0.02;
        let rodHeight = gameManager.canvasHeight * 0.15;

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            (gameManager.canvasWidth / 2) - (rodWidth / 2),
            gameManager.canvasHeight - rodHeight,
            rodWidth,
            rodHeight
        );

        return [(gameManager.canvasWidth / 2), gameManager.canvasHeight - rodHeight];
    },

    // 낚시 찌와 낚시대 끝 위치 사이 줄긋기.
    drawRod: function (bobber, rodTop) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(rodTop[0], rodTop[1]);
        ctx.lineTo(bobber.positionX, bobber.positionY);
        ctx.stroke();
    }
}


/** Navigation-inputManager */
// 모든 입력 이벤트 분기를 받는 매니저
let inputManager = {

    getInput: function (e) {
        // console.log('key pressed, frameCount: ' + gameManager.frameCount);
        switch (e.code) {
            case 'KeyW':    // 'w'
            case 'ArrowUp':
                gameManager.bobber.moveThis(0);
                break;

            case 'KeyA':    // 'a'
            case 'ArrowLeft':
                gameManager.bobber.moveThis(1);
                break;

            case 'KeyD':      // 'd'
            case 'ArrowRight':
                gameManager.bobber.moveThis(2);
                break;

            case 'KeyS':   // 's'
            case 'ArrowDown':
                gameManager.bobber.moveThis(3);
                break;

            case 'Space':
                if (gameManager.stats[2] == 0) {
                    console.log('Player started fishing');
                    gameManager.startFishing();
                }
                else if (gameManager.stats[2] == 1) {
                    console.log('Player stopped fishing');
                    gameManager.stopFishing();
                }
                break;
        }
    }
}

document.addEventListener('keydown', inputManager.getInput);
mainLoop();
