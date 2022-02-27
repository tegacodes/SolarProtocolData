//Getting a value from the Solar Protocol API

let value = "PV-voltage";
let baseURL = 'http://solarprotocol.net/api/v1/opendata.php?value=';

function setup() {
  createCanvas(windowWidth, windowHeight);
  //preview data at http://solarprotocol.net/api/v1/chargecontroller.php
  //get data, then run callback gotData
  loadJSON(baseURL+value, gotData); 
 
  background(210);
  textFont('Times');
  textSize(12);

  noLoop();
}

function draw() {
  
}

//runs when data has been received. 
function gotData(tempData){
  let val = tempData;

  //display on screen
  text(value, 50,50);
  text(tempData, 50,70);
}
