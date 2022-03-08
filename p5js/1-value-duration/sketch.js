//This example graphs energy parameters through time from current active server in the Solar Protocol network.
//preview data at http://solarprotocol.net/api/v2/opendata.php?value=PV-voltage&duration=2

//Set margins for the graph
let yMargin = 50;
let xMargin = 50;

let dataV = []; //Array to hold voltage data
let dataC = []; //Array to hold current data

let pd, ph = 0;
let v =0;
let colors;
let c=0; //color counter

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadJSON('http://solarprotocol.net/api/v2/opendata.php?value=PV-voltage&duration=2', gotVData); 
  loadJSON('http://solarprotocol.net/api/v2/opendata.php?value=PV-current&duration=2', gotCData); 

  // Offline data
  // loadJSON('../../data/1-PVVoltage-2d.json', gotVData); 
  // loadJSON('../../data/1-PVCurrent-2d.json', gotCData); 

  background(210);
  strokeWeight(0.5);
  textFont('Times');
  textSize(12);
 
  colors = ["blue", "red", "green", "yellow", "pink", "orange", "purple"];

  noLoop(); //no need to loop draw
}

function draw() {
  drawAxes();
}

function gotVData(tempData){
  // console.log(Object.keys(tempData.data));

  //put dates into arrays
  let dateStrings = Object.keys(tempData.data);
  //put valees into an array 
  let vals = Object.values(tempData.data);


  //convert date strings into dayjs objects. Push date objects and values onto an array called dataV. 
  for(let i=0;i<dateStrings.length; i++){
    dataV.push({date: dayjs(dateStrings[i]), val: Number(vals[i])})
  }

  //sort data by date so that it is in order
  dataV = dataV.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
  
  //draw data sending name and data array as arguments
  drawData(tempData.header.datetime, dataV); 
}

function gotCData(tempData){
  //put dates and vales into arrays
  let dateStrings = Object.keys(tempData.data);
  let vals = Object.values(tempData.data);

  //convert date strings into dayjs objects. Push date objects and values onto an array called data. 
  for(let i=0;i<dateStrings.length; i++){
    dataC.push({date: dayjs(dateStrings[i]), val: Number(vals[i])})
  }

  //sort data by date so that it is in order
  dataC = dataC.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1));
  print(dataC);
  
  //draw data sending name and data array as arguments
  drawData(tempData.header.datetime, dataC); 
}

function drawData(name, data){
  //find max value of the parameter
  let maxVal = max(data.map(d => d.val));
  
  //find minimum and maximum time stamps
  let minUnix = min(data.map(d => d.date.unix()));
  let maxUnix = max(data.map(d => d.date.unix()));
  // console.log(dayjs.unix(maxUnix));
  // console.log(dayjs.unix(minUnix));

  let px = xMargin;
  let py = height-yMargin;
  //graph data from data array
  for(let i=0;i<data.length; i++){
    //get y coordinates of points by remapping the values to the y axix
    let y = map(data[i].val, 0, maxVal, height - yMargin, 0 + yMargin);
    //get x coordinates of points by remapping the dates to the x axix
    let x = map(data[i].date.unix(), minUnix, maxUnix, xMargin, width - xMargin);
   
    //set color
    stroke(colors[c]);
    fill(colors[c]);

    //draw data
    line(px, py, x, y);
    //ellipse(x, y, 2, 2);

    //store previous values if you want to draw a line
    px = x;
    py = y;
  }
  rect(xMargin+80*v, height-30, 10, 10);
  stroke(0);
  fill(0);
  text(name, xMargin+20+80*v, height-20);
  v++; //shift over label 
  c++; //move to next
}

function drawAxes(){
    //draw axes
    stroke(0,0,0);
    line(0 + xMargin, height - yMargin, 0 + xMargin, 0 + yMargin); // y axis
    line(0 + xMargin, height - yMargin, width - xMargin, height - yMargin); //x axis
}
