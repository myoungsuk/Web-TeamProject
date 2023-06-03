 const omok = document.querySelector("#omok");
const ctx = omok.getContext("2d");
// id가 omok인 HTML 요소를 선택하고, 이를 이용해 2D 그래픽을 그릴 수 있는 context를 가져옵니다.


// 바둑판의 셀 크기, x, y 좌표의 시작점, 바둑돌의 반지름, 총 셀의 수, 그리고 캔버스의 가로, 세로 길이를 설정합니다.
const cellSize = 40,
    offsetX = 40,
    offsetY = 40,
    stoneRadius = 17,
    CELLS = 19,
    CELLS_DRAW = CELLS - 1,
    width = omok.width,
    height = omok.height;

// 바둑판의 셀 정보를 저장할 배열, 각 플레이어의 최고 연속 점수, 마우스 클릭 여부, 현재 턴을 설정합니다.
let lines = [];
let player1HighScore = 0;
let player2HighScore = 0;
let clicked = false;
let myTurn = true;

// 플레이어의 돌 색상과 바둑판의 색상을 설정하며, 현재 돌 색상을 첫 플레이어 색상으로 설정합니다.
let myConfig = {
    stoneColor: {

        player1: "#121212",
        player2: "#f8faf5",

    },
    boardColor: "#FFE4B5",
    // my stone color; player2 stone color; ...
};
let stoneColor = myConfig["stoneColor"]["player1"];

// Cell과 Stone 생성자 함수를 만듭니다. 각각 바둑판의 셀과 바둑돌을 나타냅니다.
function Cell(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
}

function Stone(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
}

// Cell과 Stone에 draw 메서드를 추가합니다. 이 메서드는 각각 바둑판의 셀과 바둑돌을 그리는 역할을 합니다.
Cell.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = myConfig["boardColor"];
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
};

Stone.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};


// 게임이 끝났을 때 호출되는 함수입니다. 게임 정보를 초기화하고, 바둑판을 다시 그린 후, 클릭 이벤트 리스너를 다시 등록합니다.
function gameOver() {

    lines = [];
    player1HighScore = 0;
    player2HighScore = 0;
    clicked = false;
    myTurn = true;

    ctx.clearRect(0, 0, width, height);
    requestAnimationFrame(loop);
    makeInformation();
    omok.addEventListener("click", drawStone);
}

// 6개 이상의 돌이 일직선으로 놓였는지 확인하는 함수입니다.
function checkSixInARow(row, col) {
    let currentCell = lines[row][col]; // 현재 셀 정보 가져오기
    let directions = [[1, 0], [0, 1], [1, 1], [1, -1]]; // 가로, 세로, 대각선 방향 체크를 위한 배열

    // 각 방향에 대해 검사하기
    for (let direction of directions) {
        let count = 1; // 현재 셀 포함
        // 양방향으로 검사하기
        for (let dir = -1; dir <= 1; dir += 2) {
            let r = row + direction[0] * dir, c = col + direction[1] * dir;
            while (r >= 0 && r < lines.length && c >= 0 && c < lines[r].length && lines[r][c].occupiedType === currentCell.occupiedType) {
                count++;
                r += direction[0] * dir;
                c += direction[1] * dir;
            }
        }

        if (count >= 6) { // 6개 이상의 돌이 일직선으로 놓였을 경우
            return true;
        }
    }

    return false;
}

// 삼수금지를 체크하는 함수입니다.
function checkDoubleThree(row, col) {
    let currentCell = lines[row][col]; // 현재 셀 정보 가져오기
    let directions = [[1, 0], [0, 1], [1, 1], [1, -1]]; // 가로, 세로, 대각선 방향 체크를 위한 배열
    let countThrees = 0; // 연속된 3개 돌의 수

    // 각 방향에 대해 검사하기
    for (let direction of directions) {
        let count = 1; // 현재 셀 포함
        // 양방향으로 검사하기
        for (let dir = -1; dir <= 1; dir += 2) {
            let r = row + direction[0] * dir, c = col + direction[1] * dir;
            while (r >= 0 && r < lines.length && c >= 0 && c < lines[r].length && lines[r][c].occupiedType === currentCell.occupiedType) {
                count++;
                r += direction[0] * dir;
                c += direction[1] * dir;
            }
        }

        if (count === 3) { // 3개의 돌이 연속되었을 경우
            countThrees++;
        }
    }

    if (countThrees >= 2) { // 삼수금지 조건에 부합할 경우
        return true;
    }

    return false;
}

// 플레이어의 연속 점수를 확인하고, 승리 조건을 만족하는지 확인하는 함수입니다. 만약 승리 조건을 만족하면, 승리 알림을 보여주고 게임을 종료합니다.
function scoreCheck(p1, p2) {
    if (p1 !== 5 && p2 !== 5) return;
    omok.removeEventListener("click", drawStone);
    if (p1 === 5) {
        setTimeout(() => {
            alert("player1 wins!");
            gameOver();
        }, 500);
    } else if (p2 === 5) {
        setTimeout(() => {
            alert("player2 wins!");
            gameOver();
        }, 500);
    }
}

// 특정 셀을 기준으로 주변 셀을 확인하며, 동일한 색상의 돌이 연속으로 몇 번 나타나는지 확인하는 함수입니다. 이를 통해 각 플레이어의 연속 점수를 계산합니다.
function checkCondition(row, col, iter) {
    // row: number, col: number, iter: number (int)
    // x = row, y = col
    let currentLocation = lines[row][col]; // {x, y, offsetX, offsetY, isOccupied, OccupiedType}
    let numberOfSameColorStones = 0;
    let temp = 0;

    // // 추가된 코드: 장목금지 체크
    // if (numberOfSameColorStones >= 6) {
    //     alert("장목금지: 6개 이상의 돌이 일직선으로 놓일 수 없습니다.");
    //     handleCell(row, col, true);
    // }

    console.log("check condition");
    // 가로줄 탐색
    for (
        let i = col - iter >= 0 ? col - iter : 0;
        i <= (col + iter < CELLS ? col + iter : CELLS - 1);
        i++
    ) {
        console.log("가로줄 탐색", i);
        if (currentLocation.occupiedType === lines[row][i].occupiedType) {
            temp++;
            // console.log("temp 증가:", temp);
            if (numberOfSameColorStones <= temp) {
                numberOfSameColorStones = temp;
            }
        } else {
            // console.log("temp 원위치:", temp);
            temp = 0;
        }
    }

    // temp 초기화
    temp = 0;

    // 세로줄 탐색
    for (
        let i = row - iter >= 0 ? row - iter : 0;
        i <= (row + iter < CELLS ? row + iter : CELLS - 1);
        i++
    ) {
        console.log("세로줄 탐색", i);
        if (currentLocation.occupiedType === lines[i][col].occupiedType) {
            temp++;
            if (numberOfSameColorStones <= temp) {
                numberOfSameColorStones = temp;
            }
        } else {
            temp = 0;
        }
    }

    // temp 초기화
    temp = 0;

    // 대각선 탐색
    for (let i = -iter; i < iter + 1; i++) {
        console.log("대각선 탐색 (우하향)");
        console.log(i);
        if (row + i >= 0 && col + i >= 0 && row + i < 19 && col + i < 19) {
            console.log(lines[row + i][col + i]);
            if (
                currentLocation.occupiedType === lines[row + i][col + i].occupiedType
            ) {
                temp++;
                if (numberOfSameColorStones <= temp) {
                    numberOfSameColorStones = temp;
                }
            } else {
                temp = 0;
            }
        }
    }

    for (let i = -iter; i < iter; i++) {
        console.log("대각선 탐색 (우상향)");
        if (row - i >= 0 && col + i >= 0 && row - i < 19 && col + i < 19) {
            console.log(lines[row - i][col + i]);
            if (
                currentLocation.occupiedType === lines[row - i][col + i].occupiedType
            ) {
                temp++;
                if (numberOfSameColorStones <= temp) {
                    numberOfSameColorStones = temp;
                }
            } else {
                temp = 0;
            }
        }
    }

    if (myTurn) {
        player1HighScore =
            player1HighScore < numberOfSameColorStones
                ? numberOfSameColorStones
                : player1HighScore;
    } else {
        player2HighScore =
            player2HighScore < numberOfSameColorStones
                ? numberOfSameColorStones
                : player2HighScore;
    }

    scoreCheck(player1HighScore, player2HighScore);
    console.log("p1:", player1HighScore);
    console.log("p2:", player2HighScore);
}


// 마우스 클릭 이벤트를 처리하는 함수입니다. 클릭한 위치에 바둑돌을 그리고, 해당 셀의 정보를 업데이트하며, 연속 점수를 확인합니다.
function drawStone(e) {
    if (30 > e.offsetX || e.offsetX >= 770 || 30 > e.offsetY || e.offsetY >= 770)
        return;
    const [x, y] = [e.offsetX, e.offsetY];
    const [calibratedX, calibratedY] = [
        Math.round(x / cellSize) * cellSize,
        Math.round(y / cellSize) * cellSize,
    ];
    const [col, row] = [calibratedX / cellSize - 1, calibratedY / cellSize - 1];
    stoneColor = myTurn
        ? myConfig["stoneColor"]["player1"]
        : myConfig["stoneColor"]["player2"];
    console.log(calibratedX, calibratedY);
    if (!lines[row][col].isOccupied) {
        const stone = new Stone(calibratedX, calibratedY, stoneRadius, stoneColor);
        stone.draw();
        // 특정 셀의 정보를 업데이트하는 함수입니다.
        handleCell(row, col);
        checkCondition(row, col, 4);
        myTurn = !myTurn;
        // console.table(lines);
        // 그린 다음에 돌이 연속으로 다섯개 놓여져 있는지 확인
    }
}


let stoneStack = []; // 바둑돌의 기록을 저장하는 스택

// 새로운 바둑돌이 놓일 때 스택에 추가
function placeStone(row, col, color) {
    if (!lines[row][col].isOccupied) {
        const stone = new Stone(col * cellSize, row * cellSize, stoneRadius, color);
        stone.draw();
        stoneStack.push({ row, col, color }); // Add to stack
        handleCell(row, col);
        if(checkCondition(row, col, 4)){
            undoStone();
        }
        myTurn = !myTurn;
    }
}

function undoStone() {
   if (stoneStack.length > 0) {
        let lastStone = stoneStack.pop(); // Remove from stack
        handleCell(lastStone.row, lastStone.col, true); // Reset cell
        clearBoard();  // Clear the board
        drawBoard();   // Redraw the board
    }
}
function clearBoard() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let cell = new Cell(i * cellSize, j * cellSize, cellSize);
            cell.draw();
        }
    }
    for (let stone of stoneStack) {
        let stone = new Stone(stone.col * cellSize, stone.row * cellSize, stoneSize, stone.color);
        stone.draw();
    }
}

// 특정 셀의 정보를 업데이트하는 함수입니다.
function handleCell(row, col, isReset = false) {

    if (isReset) {
        lines[row][col].isOccupied = false;
        lines[row][col].occupiedType = 0;
    } else {
        lines[row][col].isOccupied = true;
        const occupiedType = myTurn ? 1 : 2;
        lines[row][col].occupiedType = occupiedType;

        // 새로 놓인 돌이 6개 이상 연속으로 놓였는지 확인합니다.
        if (checkSixInARow(row, col)) {
            alert("6개 이상의 돌이 연속으로 놓였습니다. 게임을 종료합니다.");
            resetGame();
            return;
        }

        // 추가된 코드: 삼수금지 체크
        if (checkDoubleThree(row, col)) {
            alert("삼수금지: 동일한 색상의 돌이 세 개 연속으로 놓여 있는 상황이 두 곳 이상일 수 없습니다.");
            resetGame();
            // return;

        }

    }

}

// 게임 정보를 생성하는 함수입니다.
function makeInformation() {
    for (let i = 0; i < CELLS; i++) {
        lines[i] = [];
        for (let j = 0; j < CELLS; j++) {
            lines[i].push({
                x: offsetX + j * cellSize,
                y: offsetY + i * cellSize,
                isOccupied: false,
                occupiedType: 0,
            });
        }
    }
}

// 게임 루프를 생성하는 함수입니다. 이 함수는 바둑판을 그리고, 클릭 이벤트 리스너를 등록합니다.
function loop() {
    for (let i = 0; i < CELLS; i++) {
        for (let j = 0; j < CELLS; j++) {
            const cell = new Cell(lines[i][j].x, lines[i][j].y, cellSize);
            cell.draw();
        }
    }
}

// 게임 초기화
function resetGame() {
    ctx.clearRect(0, 0, width, height);
    makeInformation();
    requestAnimationFrame(loop);
    myTurn = false;
    player1HighScore = 0;
    player2HighScore = 0;
}


requestAnimationFrame(loop);
makeInformation();
// console.table(lines);
// 페이지가 로드되면 바둑판을 그리고, 바둑판의 셀 정보를 초기화하며, 클릭 이벤트 리스너를 등록합니다.
omok.addEventListener("click", drawStone);
