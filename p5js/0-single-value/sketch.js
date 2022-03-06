//Getting a value from the Solar Protocol API
//preview data at http://solarprotocol.net/api/v1/

let CCparam = "PV-voltage";
let baseURL = 'http://solarprotocol.net/api/v2/opendata.php?value=';
let offLineData = "../../data/0-single-value.json";

function setup() {
  createCanvas(windowWidth, windowHeight);
  //get data, then run callback gotData
  loadJSON(baseURL+CCparam, gotData); 
  // loadJSON(offLineData, gotData); 
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

  //print data in console
  console.log(tempData);

  //display on screen
  text(CCparam, 50,50);
  text(tempData["PV-voltage"], 50,70);

}
