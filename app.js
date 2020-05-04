
//buttons
let rightButtonCode;
let leftButtonCode;
let upButtonCode;
let downButtonCode;
//settings
let monsterNumber;
let ballsNumber;
let timer;
let colors;
let score;
let start_time;
let remainBalls;
let lifeNumber;
// monsters and packmen
let supriseCandy;
let clockCandy;
let pacmenPosition;
let monsters;
let pointsMonster;
let context;
let board;
let interval;
let direction;


function setSettings()
{
    lifeNumber=5;
    $("#timerSetting").text("Timer: "+timer);
    $("#monstertsNumber").text("Number of monsters: "+monsterNumber)
    $("#ballsNumber").text("Number of balls: "+ballsNumber);
    $("#ballsRemains").text("Remain balls: "+remainBalls);
    $("#upButtonS").text("up button: "+ getDigit(upButtonCode));
    $("#downButtonS").text("down button: "+ getDigit(downButtonCode));
    $("#rightButtonS").text("right button: "+ getDigit(rightButtonCode));
    $("#leftButtonS").text("left button: "+ getDigit(leftButtonCode));
    $("#5pointsColorS").css("color",colors[0]);
    $("#15pointsColorS").css("color",colors[1]);
    $("#25pointsColorS").css("color",colors[2]);
    $('audio#gameSong')[0].play();
}

function getDigit(hasci)
{
    let ans="";
    if(hasci>=37 &&hasci<=40)
    {
        if(hasci==37)
        {
            ans="left arrow";
        }
        else if(hasci==38)
        {
            ans="up arrow";
        }
        else if(hasci==39)
        {
            ans="right arrow";
        }
        else 
        {
            ans="down arrow";
        }
    }
    else 
    {
        ans=String.fromCharCode(hasci);
    }
    return ans;
}


function Start() {
	context = canvas.getContext("2d");
	setSettings();
	board = new Array();
	score = 0;
	direction = 4;
	let cnt = 100;
	let food_remain = ballsNumber;
	let food15Points = Math.floor(ballsNumber * 0.30);
	let food25Points = Math.floor(ballsNumber * 0.1);
	let food5Points = ballsNumber - food15Points - food25Points;
	for (let i = 0; i < 10; i++) {
		board[i] = new Array();
		for (let j = 0; j < 10; j++) {
			var randomNum = Math.random();
			if (randomNum <= (1.0 * food_remain) / cnt) {
				randomNum = Math.random();

				if (randomNum <= 0.6 && food5Points > 0) {
					food5Points--;
					board[i][j] = 1;
					food_remain--;
				}
				else if (randomNum <= 0.9 && food15Points > 0) {
					food15Points--;
					board[i][j] = 2;
					food_remain--;
				}
				else if (food25Points > 0) {
					food25Points--;
					board[i][j] = 3
					food_remain--;
				}
				else {
					board[i][j] = 0;
				}
			}
			else {
				board[i][j] = 0;
			}
			cnt--;
		}
	}
	let balls = [food5Points, food15Points, food25Points];
	addBallsToBoard(balls);
	addPackmenToBoard();
	initMonsters();
	addMonstersToBoard();
	addPointMonsterToBoard();
	addWalls();
	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	remainBalls = ballsNumber;
	start_time = new Date();
	interval = setInterval(UpdatePosition, 250);
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLives.value = lifeNumber;
	if (time_elapsed < 15) {
		$("#lblTime").css("color", "red");
	}
	else {
		$("#lblTime").css("color", "black");
	}
	if (lifeNumber < 2) {
		$("#lblLives").css("color", "red");
	}
	else {
		$("#lblLives").css("color", "black");
	}
	$("#ballsRemains").text("Remain balls:  " + remainBalls);
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			let number = board[i][j];
			let center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (number >= 1 && number <= 3) // draw a ball 
			{
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = colors[number - 1];
				context.fill();
			}
			else if (number == 4) // draw a monster
			{
				let monsterIndex = getMonster(i, j);
				center.x = i * 60;
				center.y = j * 60;
				if (monsterIndex == -1) {
					console.log("problem");
					console.log(i + "," + j);
					for (let inde = 0; inde < monsterNumber; inde++) {
						console.log(monsters[inde].i + "," + monsters[inde].j);
					}
				}
				else {
					drawMonster(monsterIndex, center.x, center.y);
				}
			}
			else if (number == 5) // draw packmen
			{
				drawPacmen(center.x, center.y);
			}
			else if (number == 6) // draw a wall
			{
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (number == 7) // draw suprise candy
			{
				center.x = i * 60;
				center.y = j * 60;
				context.drawImage(supriseCandy.img, center.x, center.y, canvas.width / 10, canvas.height / 10)
			}
			else if (number == 8) // draw clock
			{
				center.x = i * 60;
				center.y = j * 60;
				context.drawImage(clockCandy.img, center.x, center.y, canvas.width / 10, canvas.height / 10);
			}
			else if (number == 9) // draw pointsMonster
			{
				center.x = i * 60;
				center.y = j * 60;
				context.drawImage(pointsMonster.img, center.x, center.y, canvas.width / 10, canvas.height / 10);
			}
		}
	}
}



function UpdatePosition() {
	board[pacmenPosition.i][pacmenPosition.j] = 0;
	let x = GetKeyPressed();
	if (x == 1)//up
	{
		if (pacmenPosition.j > 0 && board[pacmenPosition.i][pacmenPosition.j - 1] != 6) {
			pacmenPosition.j--;
			direction = x;
		}
	}
	if (x == 2)//down
	{
		if (pacmenPosition.j < 9 && board[pacmenPosition.i][pacmenPosition.j + 1] != 6) {
			pacmenPosition.j++;
			direction = x;
		}
	}
	if (x == 3)//left
	{
		if (pacmenPosition.i > 0 && board[pacmenPosition.i - 1][pacmenPosition.j] != 6) {
			pacmenPosition.i--;
			direction = x;
		}
	}
	if (x == 4)//right
	{
		if (pacmenPosition.i < 9 && board[pacmenPosition.i + 1][pacmenPosition.j] != 6) {
			pacmenPosition.i++;
			direction = x;
		}
	}
	if (board[pacmenPosition.i][pacmenPosition.j] > 0 && board[pacmenPosition.i][pacmenPosition.j] < 4) // eat ball
	{
		updateScore(board[pacmenPosition.i][pacmenPosition.j]);
	}
	if (board[pacmenPosition.i][pacmenPosition.j] == 7) // eat suprise candy
	{
		score = score + 50;
		removeCandyFromBoard();
	}
	if (board[pacmenPosition.i][pacmenPosition.j] == 8) // eat clock
	{
		timer = parseInt(timer) + 15;
		clockCandy.onBoard = false;
	}
	if (board[pacmenPosition.i][pacmenPosition.j] == 9)// eat points monster
	{
		pointsMonster.onBoard = false;
		score = score + 50;
		if (pointsMonster.oldValue > 0 && pointsMonster.oldValue < 4) {
			updateScore(pointsMonster.oldValue);
		}
		else if (pointsMonster.oldValue == 7) {
			score = score + 50;
			removeCandyFromBoard();
		}
		else if (pointsMonster.oldValue == 8) {
			timer = timer + 15;
			clockCandy.onBoard = false;
		}
		board[pointsMonster.i][pointsMonster.j] = 0
	}
	if (board[pacmenPosition.i][pacmenPosition.j] == 4)// monster eat the packmen
	{
		score = score - 10;
		lifeNumber--;
		if (lifeNumber == 0) {
			finishGame(1);
		}
		else
		{
			disqualification();
		}
	}
	board[pacmenPosition.i][pacmenPosition.j] = 5; // move the packmen to the new posion
	let currentTime = new Date();
	time_elapsed = timer - ((currentTime - start_time) / 1000);
	if (remainBalls <= 0) // win the game
	{
		finishGame(3);
	}
	if (time_elapsed <= 0) // finish time
	{
		finishGame(2);
	}
	else {
		if (time_elapsed < 15 && clockCandy.onBoard == false) {
			addClockToBoard();
			$('audio#clockAudio')[0].play();
		}
		if (supriseCandy.onBoard == false) {
			let random = Math.random();
			if (random < 0.10) {
				addCandyToBoard();
			}
		}
		else {
			if ((currentTime - supriseCandy.timer) / 1000 > 3) {
				removeCandyFromBoard();
			}
		}
		if (pointsMonster.onBoard) {
			movePointsMonster();
		}
		updateMonsterPosition();
		Draw();
	}
}

function updateScore(value) {
	if (value == 1) {
		remainBalls--;
		score = score + 5;
	}
	else if (value == 2) {
		remainBalls--;
		score = score + 15;
	}
	else if (value = 3) {
		remainBalls--;
		score = score + 25;
	}
}


function finishGame(reason) {
	$('audio#gameSong')[0].pause();
	let message = "";
	if (reason == 1) // no lifes
	{
		message = "loser!";
		$('audio#death')[0].play();
	}
	else if (reason == 2) // finish time
	{
		message = "You are better than " + score + " points!";
		$('audio#timeEnd')[0].play();
	}
	else if (reason == 3)//winGame
	{
		message = "Winner!!!";
		$('audio#win')[0].play();
	}
	window.clearInterval(interval);
	window.alert(message);
}

function disqualification()
{
	$('audio#disqualification')[0].play();
	if (pointsMonster.onBoard) {
		board[pointsMonster.i][pointsMonster.j] = pointsMonster.oldValue;
		addPointMonsterToBoard();
	}
	for (let index = 0; index < monsterNumber; index++) {
		let mx = monsters[index].i;
		let my = monsters[index].j;
		board[mx][my] = monsters[index].oldValue;
	}
	addMonstersToBoard();
	let emptyCell = findRandomEmptyCell(board);
	pacmenPosition.i = emptyCell[0];
	pacmenPosition.j = emptyCell[1];
}

function startNewGame() {
	if (remainBalls <= 0 || time_elapsed <= 0 || lifeNumber == 0) {
		Start();
	}
	else {
		$('audio#gameSong')[0].pause();
		window.clearInterval(interval);
		Start();
	}
}

function exitGame() {
	$('audio#gameSong')[0].pause();
	window.clearInterval(interval);
}



function GetKeyPressed() {
	if (keysDown[upButtonCode]) {
		return 1;
	}
	if (keysDown[downButtonCode]) {
		return 2;
	}
	if (keysDown[leftButtonCode]) {
		return 3;
	}
	if (keysDown[rightButtonCode]) {
		return 4;
	}
}

function addCandyToBoard() {
	let emptyCell = findRandomEmptyCell(board);
	supriseCandy.onBoard = true;
	supriseCandy.timer = new Date();
	supriseCandy.i = emptyCell[0];
	supriseCandy.j = emptyCell[1];
	board[emptyCell[0]][emptyCell[1]] = 7;
}

function addClockToBoard() {
	let emptyCell = findRandomEmptyCell(board);
	clockCandy.onBoard = true;
	board[emptyCell[0]][emptyCell[1]] = 8;
}

function removeCandyFromBoard() {
	supriseCandy.onBoard = false;
	board[supriseCandy.i][supriseCandy.j] = 0;
	let mIndex = getMonster(supriseCandy.i, supriseCandy.j);
	if (mIndex != -1) {
		monsters[mIndex].oldValue = 0;
	}
	if (pointsMonster.onBoard && pointsMonster.i == supriseCandy.i && pointsMonster.j == supriseCandy.j) {
		pointsMonster.oldValue = 0;
	}
}

// put monsters to board
function addMonstersToBoard() {
	for (let index = 0; index < monsterNumber; index++) {
		if (index == 0) {
			monsters[index].oldValue = board[0][0];
			board[0][0] = 4;
			monsters[index].i = 0;
			monsters[index].j = 0;
		}
		else if (index == 1) {
			monsters[index].oldValue = board[9][9];
			board[9][9] = 4;
			monsters[index].i = 9;
			monsters[index].j = 9;
		}
		else if (index == 2) {
			monsters[index].oldValue = board[0][9];
			board[0][9] = 4;
			monsters[index].i = 0;
			monsters[index].j = 9;
		}
		else {
			monsters[index].oldValue = board[9][0];
			board[9][0] = 4;
			monsters[index].i = 9;
			monsters[index].j = 0;
		}
	}
}

// find random position for the packmen
function addPackmenToBoard() {
	let emptyCell = findRandomEmptyCell(board)
	pacmenPosition = new Object();
	pacmenPosition.i = emptyCell[0];
	pacmenPosition.j = emptyCell[1];
}

// add all balls to game board
function addBallsToBoard(ballsArray) {
	for (let i = 0; i < ballsArray.length; i++) {
		let number = ballsArray[i];
		while (number > 0) {
			let emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = i + 1;
			number--;
		}
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

// get the right button key
function getRightButtonCode(eventR) {
	rightButtonCode = eventR.keyCode;
	$("#rightButtonCode").css("color", "green");
}
// get the left button key
function getLeftButtonCode(eventL) {
	leftButtonCode = eventL.keyCode;
	$("#leftButtonCode").css("color", "green");
}
//get the up button key
function getUpButtonCode(eventU) {
	upButtonCode = eventU.keyCode;
	$("#upButtonCode").css("color", "green");
}
//get the down button key
function getDownButtonCode(eventD) {
	downButtonCode = eventD.keyCode;
	$("#downButtonCode").css("color", "green");
}

function submitSettings() {
	$("#settings").hide();
	colors = new Array();
	colors[0] = $("#5pointsBall").val();
	colors[1] = $("#15pointsBall").val();
	colors[2] = $("#25pointsBall").val();
	timer = $("#timer").val();
	ballsNumber = $("#balls").val();
	monsterNumber = $("#monsters").val();
	if (upButtonCode === undefined || downButtonCode === undefined || leftButtonCode === undefined || rightButtonCode === undefined) {
		alert("you must choose button for each operation");
	}
	else if (upButtonCode == downButtonCode || upButtonCode == rightButtonCode || upButtonCode == leftButtonCode ||
		downButtonCode == leftButtonCode || downButtonCode == rightButtonCode || leftButtonCode == rightButtonCode) {
		alert("The same button is not given for several operations, please select buttons again");
	}
	else if (timer >= 60 && ballsNumber >= 50 && ballsNumber <= 90 && monsterNumber >= 1 && monsterNumber <= 4) {
		gameFunc();
	}
	else {
		alert("wrong input : balls nomber must be between 50-90, monserts nomber must be between 1-4 , timer must be at least 60 sec.")
	}
}
// create random game
function randomSettings() {
	$("#settings").hide();
	colors = new Array();
	timer = Math.floor(Math.random() * 120) + 60;
	monsterNumber = Math.floor(Math.random() * 4) + 1;
	ballsNumber = Math.floor(Math.random() * 41) + 50;
	// buttons
	leftButtonCode = 37;
	upButtonCode = 38;
	rightButtonCode = 39;
	downButtonCode = 40;
	// balls colors
	colors[0] = makeRandomColor();
	colors[1] = makeRandomColor();
	colors[2] = makeRandomColor();
	gameFunc();

}

// create random color
function makeRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

// draw the packmen by direction  
function drawPacmen(x, y) {
	context = canvas.getContext("2d");
	context.beginPath();
	if (direction == 4)//right
	{
		context.arc(x, y, 30, 0.15 * Math.PI, 1.85 * Math.PI);
		context.lineTo(x, y);
		context.fillStyle = "yellow";
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(x + 5, y - 15, 5, 0, 2 * Math.PI);
	}
	if (direction == 3)//left
	{
		context.arc(x, y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(x, y);
		context.fillStyle = "yellow";
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(x - 5, y - 15, 5, 0, 2 * Math.PI);
	}
	if (direction == 1)//up
	{
		context.arc(x, y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(x, y);
		context.fillStyle = "yellow";
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(x - 15, y - 5, 5, 0, 2 * Math.PI);
	}
	if (direction == 2)//down
	{
		context.arc(x, y, 30, 0.65 * Math.PI, 0.35 * Math.PI);
		context.lineTo(x, y);
		context.fillStyle = "yellow";
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(x + 15, y + 5, 5, 0, 2 * Math.PI);
	}
	context.fillStyle = "black";
	context.fill();
}

function addWalls() {
	let empty = 98 - ballsNumber - monsterNumber;
	empty = Math.floor(empty / 4)+1;
	for (let i = 0; i < empty; i++) {
		let emptyCell = findRandomEmptyCell(board);
		if (emptyCell[0] != 9 && emptyCell[0] != 0) {
			board[emptyCell[0]][emptyCell[1]] = 6;
		}
	}
}

function drawMonster(index, x, y) {
	context.drawImage(monsters[index].img, x, y, canvas.width / 10, canvas.height / 10);
}

function canMoveMonster(mx, my, direction) {
	if (direction == 1)//up
	{
		if (my > 0 && board[mx][my - 1] != 6 && board[mx][my - 1] != 4 && board[mx][my - 1] != 9)//up
		{
			return true;
		}
	}
	else if (direction == 2)//down
	{
		if (my < 9 && board[mx][my + 1] != 6 && board[mx][my + 1] != 4 && board[mx][my + 1] != 9) {
			return true;
		}
	}
	else if (direction == 3)//left
	{
		if (mx > 0 && board[mx - 1][my] != 6 && board[mx - 1][my] != 4 && board[mx - 1][my] != 9) {
			return true;
		}

	}
	else if (direction == 4)//right
	{
		if (mx < 9 && board[mx + 1][my] != 6 && board[mx + 1][my] != 4 && board[mx + 1][my] != 9) {
			return true;
		}

	}
	return false;
}

function moveMonsterByDistance(mx, my) {
	let px = pacmenPosition.i;
	let py = pacmenPosition.j;
	let deltax=mx-px;
	let deltay=my-py;
	if(Math.abs(deltax)>Math.abs(deltay))
	{
		if(deltax<0) // move right
		{
			if (canMoveMonster(mx, my, 4))//right
			{
				return 4;
			}
		}
		else // move left
		{
			if (canMoveMonster(mx, my, 3))
			{
				return 3;
			}
		}
	}
	if(deltay<0)
	{
		if (canMoveMonster(mx.my, 2))
		{
			return 2;
		}
	}
	else 
	{
		if (canMoveMonster(mx.my, 1))
		{
			return 1;
		}
	}
	return moveMonsterRandom(mx,my);
}

function moveMonsterRandom(mx, my) {
	let randomNum = Math.floor(Math.random() * 4);
	for (let i = 0; i < 4; i++) {
		if (canMoveMonster(mx, my, randomNum)) {
			return randomNum;
		}
		randomNum++;
		randomNum = randomNum % 4;
	}
	return 0;
}

function updateMonsterPosition() {
	for (let index = 0; index < monsters.length; index++) {
		let mx = monsters[index].i;
		let my = monsters[index].j;
		board[mx][my] = monsters[index].oldValue;
		let move = 0;
		move = moveMonsterByDistance(mx, my)
		if (move == 1)//up
		{
			monsters[index].oldValue = board[mx][my - 1];
			board[mx][my - 1] = 4;
			monsters[index].j = my - 1;
		}
		else if (move == 2)//down
		{
			monsters[index].oldValue = board[mx][my + 1];
			board[mx][my + 1] = 4;
			monsters[index].j = my + 1;
		}
		else if (move == 3)//left
		{
			monsters[index].oldValue = board[mx - 1][my];
			board[mx - 1][my] = 4;
			monsters[index].i = mx - 1;
		}
		else if (move == 4)//right
		{
			monsters[index].oldValue = board[mx + 1][my];
			board[mx + 1][my] = 4;
			monsters[index].i = mx + 1;
		}
		else if (move == 0)//stay in place
		{
			monsters[index].oldValue = board[mx][my];
			board[mx][my] = 4;
			monsters[index].i = mx;
		}
		if (monsters[index].oldValue == 5)
		{
			score = score - 10;
			lifeNumber--;
			board[monsters[index].i][monsters[index].j] = 0;
			monsters[index].oldValue = 0;
			if (lifeNumber == 0) {
				finishGame(1);
			}
			else
			{
				disqualification()
			}
			return;
		}
	}
}

function movePointsMonster() {
	let mx = pointsMonster.i;
	let my = pointsMonster.j;
	board[mx][my] = pointsMonster.oldValue;
	move = moveMonsterRandom(mx, my);
	if (move == 1)//up
	{
		pointsMonster.oldValue = board[mx][my - 1];
		board[mx][my - 1] = 9;
		pointsMonster.j = my - 1;
	}
	else if (move == 2)//down
	{
		pointsMonster.oldValue = board[mx][my + 1];
		board[mx][my + 1] = 9;
		pointsMonster.j = my + 1;
	}
	else if (move == 3)//left
	{
		pointsMonster.oldValue = board[mx - 1][my];
		board[mx - 1][my] = 9;
		pointsMonster.i = mx - 1;
	}
	else if (move == 4)//right
	{
		pointsMonster.oldValue = board[mx + 1][my];
		board[mx + 1][my] = 9;
		pointsMonster.i = mx + 1;
	}
	else if (move == 0)//stay in place
	{
		pointsMonster.oldValue = board[mx][my];
		board[mx][my] = 9;
		pointsMonster.i = mx;;
	}
	if (pointsMonster.oldValue == 5) {
		mx = pointsMonster.i;
		my = pointsMonster.j;
		board[mx][my] = 5;
		pointsMonster.onBoard = false;
		score = score + 50;
	}
}

function getMonster(x, y) {
	for (let index = 0; index < monsters.length; index++) {
		if (monsters[index].i == x && monsters[index].j == y) {
			return index;
		}
	}
	return -1;
}

function initMonsters() {
	monsters = new Array();
	for (let index = 0; index < monsterNumber; index++) {
		monsters[index] = new Object();
		let monsterImg = new Image();
		monsterImg.src = "resources/packman" + index + ".png";
		monsters[index].img = monsterImg;
		monsters[index].oldValue = -1;
	}
	supriseCandy = new Object();
	let candyImg = new Image();
	candyImg.src = "resources/supriseCandy.png";
	supriseCandy.img = candyImg;
	supriseCandy.onBoard = false;
	supriseCandy.timer = 0;
	clockCandy = new Object(); // clock
	let clockImg = new Image();
	clockImg.src = "resources/clock.png";
	clockCandy.img = clockImg;
	clockCandy.onBoard = false;
	pointsMonster = new Object();
	let pMonsterImg = new Image();
	pMonsterImg.src = "resources/pointsMonster.png";
	pointsMonster.img = pMonsterImg;
	pointsMonster.onBoard = true;
}

function addPointMonsterToBoard() {
	if (monsterNumber >= 4) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 9;
		pointsMonster.i = emptyCell[0];
		pointsMonster.j = emptyCell[1];
		pointsMonster.oldValue = 0;
	}
	else {
		pointsMonster.oldValue = board[9][0];
		board[9][0] = 9;
		pointsMonster.i = 9;
		pointsMonster.j = 0;
	}
}




