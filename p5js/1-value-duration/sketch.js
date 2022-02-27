//Graphing a Value from the Solar Protocol API

//Set margins for the graph
let yMargin = 50;
let xMargin = 50;

//Array to hold data
let dataV = [];
let dataC = [];

let pd, ph = 0;
let v =0;
let colors;
let c=0; //color counter

function setup() {
  createCanvas(windowWidth, windowHeight);
  //preview data at http://solarprotocol.net/api/v1/chargecontroller.php
  //loadJSON('http://solarprotocol.net/api/v1/opendata.php?value=PV-voltage&duration=2', gotPVVoltage); 
  //loadJSON('http://solarprotocol.net/api/v1/opendata.php?value=PV-current&duration=2', gotPVCurrent); 

  loadJSON('../../data/PVVoltage.json', gotVData); 
  //loadJSON('../../data/PVCurrent.json', gotPVCurrent); 
  loadJSON('../../data/PVCurrent.json', gotCData); 

  background(210);
  strokeWeight(0.5);
  textFont('Times');
  textSize(12);

 
  colors = ["blue", "red", "green", "yellow", "pink", "orange", "purple"];

  noLoop();
}

function draw() {
  drawAxes();


}

function gotVData(tempdata){
  //put dates and vales into arrays
  dateStrings = Object.keys(tempdata);
  vals = Object.values(tempdata);

  //convert date strings into dayjs objects. Push date objects and values onto an array called data. 
  for(let i=1;i<dateStrings.length; i++){
    dataV.push({date: dayjs(dateStrings[i]), val: Number(vals[i])})
  }

  //sort data by date so that it is in order
  dataV = dataV.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
  
  //draw data sending name and data array as arguments
  drawData(vals[0], dataV); 
}

function gotCData(tempdata){
  //put dates and vales into arrays
  dateStrings = Object.keys(tempdata);
  vals = Object.values(tempdata);

  //convert date strings into dayjs objects. Push date objects and values onto an array called data. 
  for(let i=1;i<dateStrings.length; i++){
    dataC.push({date: dayjs(dateStrings[i]), val: Number(vals[i])})
  }

  //sort data by date so that it is in order
  dataC = dataC.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
  
  //draw data sending name and data array as arguments
  drawData(vals[0], dataC); 
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

// function drawLabels(_maxVal, _minUnix, _maxUnix){
//   //draw y labels 
//   for(let j=0; j< _maxVal; j++){
//     let yPos = map(j,0,_maxVal, height-yMargin, yMargin);
//     text(j, xMargin-15, yPos);
//   }

//   //draw x labels (time)
//   let startDay = dayjs.unix(_minUnix).date();
//   let endDay = dayjs.unix(_maxUnix).date();

//   let startHour = dayjs.unix(_minUnix).hour();
//   let endHour = dayjs.unix(_maxUnix).hour();

//   // console.log(startDay);
//   // console.log(endDay);
//   // console.log(startHour);
//   // console.log(endHour);

//   //days
//   for(let i=startDay; i<=endDay; startDay+1){
//     console.log(i);
//     text(startDay +"/" + dayjs.unix(_minUnix).month(), xMargin, height-yMargin+30);

//   }

//    //hours
//    for(let i=startHour; i<endHour; startHour+1){
//     //console.log(i);
    
//   }
//   //   stroke(0);
//   //   fill(0);

    

//   //   

//   //   if(data[i].date.hour() != ph){
//   //     text(data[i].date.hour(), x, height-yMargin+15);
//   //   }


//   // }
// }