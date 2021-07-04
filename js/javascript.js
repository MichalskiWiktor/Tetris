const moveSound = new Audio("sounds/move.wav");
const loseSound = new Audio("sounds/lose.wav");
const lineSound = new Audio("sounds/line.wav");
const spaceSound = new Audio("sounds/space.wav");
var canUseHold = true;
var paused = false;
var board = document.getElementById("board");
var fields = board.getElementsByTagName("div");
var forbidenFieldsRight = [20];
var forbidenFieldsLeft = [20];
var colors = ["rgb(255, 236, 23)", "rgb(12, 240, 247)", "rgb(235, 23, 23)", "rgb(90, 245, 34)", "rgb(245, 22, 189)", "rgb(255, 147, 5)", "rgb(0, 0, 179)"];
window.onload = function(){
	let codeHtmlBoard="";
	for(let i=0;i<20;i++){
		for(let j=0;j<10;j++){
			codeHtmlBoard+=`<div class="squares"></div>`;
		}
		codeHtmlBoard+=`<div style="clear:both"></div>`;
	}
	let codeHtmlHold="";
	for(let i=0;i<4;i++){
		for(let j=0;j<4;j++){
			codeHtmlHold+=`<div class="squares" style="width:25%"></div>`;
		}
		codeHtmlHold+=`<div style="clear:both"></div>`;
	}
	for(let i=0;i<20;i++){
		forbidenFieldsRight[i]=9 + (11 * i);
		forbidenFieldsLeft[i]=0 + (11 * i);
	}
	document.getElementById("board").innerHTML=codeHtmlBoard;
	document.getElementById("holdShapes").innerHTML+=codeHtmlHold;
	createNewShape();
}
var myInterval=setInterval(giveOrdersToMoveShape, 500);
function checkField(i){
	let done;
	if(colors.includes(fields[i].style.backgroundColor))return true;
	else if(i==10)return false;
	else done = checkField(++i, done);
	
	if(done)return true;
}
function createNewShape(){
	for(let i=0;i<4;i++)Shape.checkIfAllLineIsFull();
	Shape.createRandomNumberOfShape();
	Shape.findCorrectShape();
	Shape.addNewCoordinatesOfShape();
}
function giveOrdersToMoveShape(){
	if(Shape.cords[0]<Shape.maxHeightCoordinates && !Shape.isEnd){
		Shape.moveShape();
		Shape.addNewCoordinatesOfShape();
	}
	else {
		if(checkField(0, false) == true){
			alert("Koniec");
			clearInterval(myInterval);
		}
		else stopIntervalAndClearShape();
	}
}
function stopIntervalAndClearShape(){
	canUseHold=true;
	clearInterval(myInterval);
	Shape.clearOldShape();
	createNewShape();
	myInterval= setInterval(giveOrdersToMoveShape, 500);
}
var Shape = {
	name: "",
	numberOfShape: 1,
	cords: [],
	score:0,
	level:0,
	lines:0,
	color:"",
	orientation:1,
	maxHeightCoordinates:18,
	isEnd:false,
	createRandomNumberOfShape: function(){
		this.numberOfShape=Math.floor((Math.random() * 7) + 1);
	},
	findCorrectShape: function(){
		switch(this.numberOfShape){
			case 1:
				this.setBasicProperties("smashboy", 18*11, [4, 5, 15, 16], colors[0]);
				break;
			case 2:
				this.setBasicProperties("hero", 16*11, [4, 15, 26, 37], colors[1]);
				break;
			case 3:
				this.setBasicProperties("clevelandred", 18*11, [4, 5, 16, 17], colors[2]);
				break;
			case 4:
				this.setBasicProperties("clevelandgreen", 19*11, [15, 16, 5, 6], colors[3]);
				break;
			case 5:
				this.setBasicProperties("teewee", 19*11, [15, 5, 16, 17], colors[4]);
				break;
			case 6:
				this.setBasicProperties("orangeRicky", 17*11, [4, 15, 26, 27], colors[5]);
				break;
			case 7:
				this.setBasicProperties("blueRicky", 19*11, [26, 27, 16, 5], colors[6]);
				break;
		}
	},
	setBasicProperties: function(name, maxHeightCoordinates, cords, color){
		this.name = name;
		this.maxHeightCoordinates = maxHeightCoordinates;
		this.cords = cords;
		this.color = color;
	},
	updateTableOfLevelScoreLines: function(){
		document.getElementById("sectionOfScore").innerHTML=this.score;
		document.getElementById("sectionOfLines").innerHTML=this.lines;
	},
	addNewCoordinatesOfShape: function(){
		this.cords.forEach(cord =>{
			fields[cord].style.backgroundColor = this.color;	
		})
	},
	removeOldCoordinatesOfShape: function(){///////////////////usuwamy figure z starych pol
		this.cords.forEach(cord =>{
			fields[cord].style.backgroundColor = "#332929";	
		})
	},
	isMovePossibleForExactShape: function(array, dir){
		if(dir=="down"){
			for(let i=0;i<array.length;i++){
				if(colors.includes(fields[this.cords[array[i]] + 11].style.backgroundColor)){
					return false;
				}
			}	
		}	
		else if(dir=="right"){
			for(let i=0;i<array.length;i++){
				if(colors.includes(fields[this.cords[array[i]] + 1].style.backgroundColor)){
					return false;
				}
			}	
		}	
		else{//left
			for(let i=0;i<array.length;i++){
				if(colors.includes(fields[this.cords[array[i]] - 1].style.backgroundColor)){
					return false;
				}
			}			
		}	

		return true;
	},
	isMoveAcceptable: function(direction){
		switch(this.name){
			case 'smashboy':{
				return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [2, 3], [1, 3], [0, 2]);
			}
			case 'hero':{
				if(this.orientation==1)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [3], [0, 1, 2, 3], [0, 1, 2, 3]);
				else
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 1, 2, 3], [3], [0]);
			}
			case 'clevelandred':{
				if(this.orientation==1)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 2, 3], [1, 3], [0, 2]);
				else
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [1, 3], [2, 3], [0, 1, 2]);
			}
			case 'clevelandgreen':{
				if(this.orientation==1)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 1, 3], [1, 3], [0, 2]);
				else
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [1, 3], [0, 2, 3], [0, 1, 3]);
			}
			case 'teewee':{
				if(this.orientation==1)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 2, 3], [1, 3], [0, 1]);
				else if(this.orientation==2)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [2, 3], [0, 2, 3], [0, 1, 2]);
				else if(this.orientation==3)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 1, 3], [1, 3], [0, 1]);
				else if(this.orientation==4)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 3], [1, 2, 3], [0, 1, 3]);
				break;
			}
			case 'orangeRicky':{
				if(this.orientation==1)
				return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [2, 3], [0, 1, 3], [0, 1, 2]);
				else if(this.orientation==2)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 1, 2], [2, 3], [0, 3]);
				else if(this.orientation==3)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 3], [1, 2, 3], [0, 2, 3]);
				else if(this.orientation==4)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 2, 3], [0, 3], [0, 1]);
				break;
			}
			case 'blueRicky':{
				if(this.orientation==1)
				return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 1], [1, 2, 3], [0, 2, 3]);
				else if(this.orientation==2)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [1, 2, 3], [0, 3], [0, 1]);
				else if(this.orientation==3)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 3], [0, 1, 3], [0, 1, 2]);
				else if(this.orientation==4)
					return this.checkIfMoveIsAccaptableForCorrectDirection(direction, [0, 1, 3], [2, 3], [0, 3]);
				break;
			}
		}
		return true;/////if false was not return
		
	},
	checkIfMoveIsAccaptableForCorrectDirection: function(direction, moveDown, moveRight, moveLeft){
		if(direction=="down")return this.isMovePossibleForExactShape(moveDown, direction);
		else if(direction=="right")return this.isMovePossibleForExactShape(moveRight, direction);
		else return this.isMovePossibleForExactShape(moveLeft, direction);
	},
	setNewOrientationOfShape: function(){
		switch(this.name){
			case 'hero':{
				if(this.orientation==1){
					this.orientation=2;
					this.maxHeightCoordinates=19*11;
					for(let i=3;i>0;i--)this.cords[i]=this.cords[i]- (11*i) + i;
					this.addNewCoordinatesOfShape();
				}
				else {
					this.orientation=1;
					this.maxHeightCoordinates=16*11;
					for(let i=3;i>0;i--)this.cords[i]=this.cords[i] + (11*i) - i;
					this.addNewCoordinatesOfShape();
				}
				break;
			}
			case 'clevelandred':{
				if(this.orientation==1)this.setNewProperties(2, 18*11, [0, 10, -22, -12]);
				else if(this.orientation==2)this.setNewProperties(1, 18*11, [0, -10, 22, 12]);
				break;
			}
			case 'clevelandgreen':{
				if(this.orientation==1)this.setNewProperties(2, 17*11, [-11, -1, 11, 21]);
				else if(this.orientation==2)this.setNewProperties(1, 18*11, [11, 1, -11, -21]);
				break;
			}
			case 'teewee':{
				if(this.orientation==1)this.setNewProperties(2, 17*11, [-22, -1, -1, -12]);
				else if(this.orientation==2)this.setNewProperties(3, 18*11, [11, 12, -10, 1]);
				else if(this.orientation==3)this.setNewProperties(4, 17*11, [1, -21, 1, 11]);
				else if(this.orientation==4)this.setNewProperties(1, 19*11, [10, 10, 10, 0]);
				break;
			}
			case 'orangeRicky':{
				if(this.orientation==1)this.setNewProperties(2, 19*11, [22, 12, 2, -10]);
				else if(this.orientation==2)this.setNewProperties(3, 17*11, [-22, -22, -12, 10]);
				else if(this.orientation==3)this.setNewProperties(4, 19*11, [22, 10, 0, -10]);
				else if(this.orientation==4)this.setNewProperties(1, 17*11, [-22, 0, 10, 10]);
				break;
			}
			case 'blueRicky':{
				if(this.orientation==1)this.setNewProperties(2, 18*11, [-11, -1, 11, 23]);
				else if(this.orientation==2)this.setNewProperties(3, 19*11, [11, -11, -23, -23]);
				else if(this.orientation==3)this.setNewProperties(4, 18*11, [-11, 1, 13, 23]);
				else if(this.orientation==4)this.setNewProperties(1, 19*11, [12, 12, 0, -22]);
				break;
			}
		}
	},
	setNewProperties: function(orientation, maxHeightCoordinates, cords){
		this.orientation = orientation;
		this.maxHeightCoordinates = maxHeightCoordinates;
		this.cords[0]+=cords[0];
		this.cords[1]+=cords[1];
		this.cords[2]+=cords[2];
		this.cords[3]+=cords[3];
		this.addNewCoordinatesOfShape();
	},
	moveShape: function(){
		if(this.isMoveAcceptable("down")==true){
			this.removeOldCoordinatesOfShape();
			for(let i=0;i<4;i++){
				this.cords[i]+=11;
			}
		}
		else this.isEnd=true;
	},
	checkIfAllLineIsFull: function(){
		for(let i=19;i>=0;i--){
			if(this.isLineFull(i)){
				this.lines++;
				this.score+=100;
				this.updateTableOfLevelScoreLines();
				for(let j=0;j<10;j++){
					fields[(i*11) + j].style.backgroundColor = "#332929";
				}
				lineSound.play();
				for(let k=i-1;k>=0;k--){
					for(let l=0;l<10;l++){
						if(fields[(k*11) + l].style.backgroundColor != fields[((k+1)*11) + l].style.backgroundColor){
							fields[((k+1)*11) + l].style.backgroundColor = fields[(k*11) + l].style.backgroundColor;
						}	
					}
				}
			}
		}
	},
	isLineFull: function(numberOfLine){
		let numberOfColoredFields=0;
		for(let i=0;i<10;i++){
			if(colors.includes(fields[(numberOfLine*11) + i].style.backgroundColor)){
					numberOfColoredFields++;
			}
		}
		if(numberOfColoredFields==10)
			return true;
		else 
			return false;
	},
	addShapeToOneOfTheTables: function(nameOfShape, nameOfTable ){
		let table = document.getElementById(nameOfTable);
		let elementsOfTable = table.getElementsByTagName("div");
		switch(nameOfShape){
			case 'smashboy':{
				this.changeColorOfFields([elementsOfTable[6], elementsOfTable[7], elementsOfTable[11], elementsOfTable[12]]);
				break;
			}
			case 'hero':{
				this.changeColorOfFields([elementsOfTable[1], elementsOfTable[6], elementsOfTable[11], elementsOfTable[16]]);
				break;
			}
			case 'clevelandred':{
				this.changeColorOfFields([elementsOfTable[6], elementsOfTable[7], elementsOfTable[12], elementsOfTable[13]]);
				break;
			}
			case 'clevelandgreen':{
				this.changeColorOfFields([elementsOfTable[7], elementsOfTable[8], elementsOfTable[11], elementsOfTable[12]]);
				break;
			}
			case 'teewee':{
				this.changeColorOfFields([elementsOfTable[7], elementsOfTable[11], elementsOfTable[12], elementsOfTable[13]]);
				break;
			}
			case 'orangeRicky':{
				this.changeColorOfFields([elementsOfTable[1], elementsOfTable[6], elementsOfTable[11], elementsOfTable[12]]);
				break;
			}
			case 'blueRicky':{
				this.changeColorOfFields([elementsOfTable[2], elementsOfTable[7], elementsOfTable[11], elementsOfTable[12]]);
				break;
			}
		}
		
	},
	changeColorOfFields: function(elementsOfTable){
		for(let i=0;i<4;i++){
			elementsOfTable[i].style.backgroundColor = this.color;
		}
	},
	clearOneOfTheTables: function(nameOfTable){
		let table = document.getElementById(nameOfTable);
		let elementsOfTable = table.getElementsByTagName("div");
		for(let i=0;i<elementsOfTable.length;i++){
			elementsOfTable[i].style.backgroundColor = "#332929";
		}		
	},
	clearOldShape: function(){
		this.cords = [0, 0, 0, 0];
		this.orientation=1;
		this.isEnd = false;
	},
}
window.addEventListener('keydown', function(event) {//////Key Codes Managment
	if(!Shape.isEnd && !paused && Shape.isMoveAcceptable("down")){
		switch (event.keyCode) {
			case 37: // Left
			case 65:{
				if(!forbidenFieldsLeft.includes(Shape.cords[0]) && Shape.isMoveAcceptable("left")){
					moveSound.play();
					Shape.removeOldCoordinatesOfShape();
					for(let i=0;i<4;i++)Shape.cords[i]--;
				}
				break;
			}
			case 39: // Right
			case 68:{
				if(!forbidenFieldsRight.includes(Shape.cords[3]) && Shape.isMoveAcceptable("right")){
					moveSound.play();
					Shape.removeOldCoordinatesOfShape();
					for(let i=0;i<4;i++)Shape.cords[i]++;
				}
				break;
			}
			case 40: // Down - SOFT DROP
			case 83:{
				if(Shape.cords[0]<Shape.maxHeightCoordinates && Shape.isMoveAcceptable("down")){
					Shape.removeOldCoordinatesOfShape();
					Shape.score++;
					for(let i=0;i<4;i++)Shape.cords[i]+=11;
					Shape.updateTableOfLevelScoreLines();
				}
				else Shape.isEnd=true;
				break;
			}
			case 32:{ ////////SPACE - HARD DROP
				spaceSound.play();
				while(Shape.isMoveAcceptable("down")){
					Shape.removeOldCoordinatesOfShape();
					Shape.score+=2; 
					for(let i=0;i<4;i++)Shape.cords[i]+=11;
					Shape.updateTableOfLevelScoreLines();
					Shape.addNewCoordinatesOfShape();
				}
				break;				
			}
			case 67:{/////////C - HOLD
				if(canUseHold){
					canUseHold=false;
					Shape.clearOneOfTheTables("holdShapes");
					Shape.addShapeToOneOfTheTables(Shape.name, "holdShapes");
					Shape.removeOldCoordinatesOfShape();
					Shape.isEnd=true;
					clearInterval(myInterval);
					Shape.clearOldShape();
					createNewShape();
					myInterval= setInterval(giveOrdersToMoveShape, 500);
				}
				break;
			}
			case 90:{/////Z - Rotate
				if(Shape.cords[0]<Shape.maxHeightCoordinates){
					Shape.removeOldCoordinatesOfShape();
					Shape.setNewOrientationOfShape();	
				}
				break;
			}
			case 27:{/////ESC - Pause
				pause();
				break;
			}
		}
		Shape.addNewCoordinatesOfShape();
	}
}, false);
const sounds = document.querySelector("#volumeButton");
sounds.addEventListener("click", function(){//////////////Mute or Unmute sounds
	moveSound.muted = !moveSound.muted;
	loseSound.muted = !loseSound.muted;
	lineSound.muted = !lineSound.muted;
	spaceSound.muted = !spaceSound.muted;
	if(document.getElementById("volumeButton").innerHTML=='<i class="icon-volume-up icons"></i>'){
		document.getElementById("volumeButton").innerHTML='<i class="icon-volume-off icons"></i>';
	}
	else document.getElementById("volumeButton").innerHTML='<i class="icon-volume-up icons"></i>';
}, false);
const pauseButton = document.querySelector("#pouseButton");
pauseButton.addEventListener("click", pause);
function pause(){
	paused=!paused;
	clearInterval(myInterval);
	if(paused){
		document.getElementById("pouseButton").innerHTML='<i class="icon-play icons"></i>';
	}
	else {
		document.getElementById("pouseButton").innerHTML='<i class="icon-pause icons"></i>';
		myInterval= setInterval(giveOrdersToMoveShape, 500);
	}
}