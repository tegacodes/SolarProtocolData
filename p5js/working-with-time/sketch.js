//this script demonstrates how to work with time in JS

//let baseURL = 'http://76.68.128.175/api/v2/opendata.php?';
//let baseURL = 'http://27.32.188.62/api/v2/opendata.php?';
let baseURL = 'http://solarprotocol.net/api/v2/opendata.php?';

let getTZ = 'systemInfo=tz';
let timeSeriesData = 'value=PV-power-L&duration=4';
//Set margins for the graph
let yMargin = 100;
let xMargin = 100;

let tz;

//ms
let duration = 2 * 24 * 60 * 60 * 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //get server timezone
  loadJSON(baseURL + getTZ, (resp)=>{tz =resp['tz'];});

  //get time series data
  loadJSON(baseURL + timeSeriesData, gotData); 

  background(210);
  strokeWeight(0.5);
  textFont('Times');
  textSize(12);
 
  colors = ["blue", "red", "green", "yellow", "pink", "orange", "purple"];

  noLoop();
}

function draw() {
  drawAxes();
  drawLabels();
}


function gotData(tempdata){
  console.log("*************************************");
  console.log("*****Investigating API response:*****");
  console.log("*************************************");

  console.log(tempdata);
  console.log(tempdata['data']);
  let timeKeys = Object.keys(tempdata['data']);
  console.log(timeKeys);
  console.log("Our time stamp as a string: " + timeKeys[0]);

  console.log("*************************************");
  console.log("*****Timezone Correction Example*****");
  console.log("*************************************");

  //local client timezone
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("Client timezone: " + localTZ);

  //server timezone for API
  console.log("Server timezone: " + tz);

  //This defaults to local time zone
  //the date object stores info in unix time
  console.log("Our date as a string is converted to date object, but it defaults to the local client time.");
  console.log("This is not a timezone conversion, merely javascript assuming the date should be treated as local time.");
  console.log("If our server timezone differs from our client timezone, this produces an innacurate time.");
  t = new Date(timeKeys[0]);
  console.log(t);
  console.log("This is our date object converted to string without changing timezone (this is incorrect):");
  console.log(t.toLocaleString('en-US', { timeZone: localTZ }));

  //convert to the required time zone
  console.log(" ");
  console.log("This is our original date object converted to a string in the server's timezone:");
  let aT = t.toLocaleString('en-US', { timeZone: tz });
  console.log(aT);
  console.log("This is a timezone unaware string, so when we convert it back to a date object (i.e. Epoch time) it is actually different from the original state.");

  //offset
  // gettime returns the milliseconds since epoch
  console.log("Now we can subtract one from the other to get the timezone offset.");
  console.log("positive numbers mean the server is ahead of the client and negative numbers means the server is behind the cient.")
  let timeDifMS = new Date(aT).getTime() - t.getTime();
  console.log("Epoch time offset: " + timeDifMS + " ms"); 
  console.log("Hours offset: " +  Math.ceil(timeDifMS/ 60/60/1000));
  //now we just need to perform the offset
  console.log("The correct local time:");
  let cTime = new Date(t - timeDifMS);
  console.log(cTime);
  console.log("and our correct string:");
  console.log(cTime.toLocaleString());

  console.log("Now with functions:");
  console.log(adjustTimeToLocal(t,getTimeZoneOffset(t,tz)));

  console.log("*************************************");
  console.log("***Timezone Correction for Data Set**");
  console.log("*************************************");

  let adjustedKeys=[];

  for (let k = 0; k < timeKeys.length; k++){
    kDate = new Date(timeKeys[k]);
    let tzOffset = getTimeZoneOffset(kDate,tz);
    //console.log(tzOffset);
    let adjustedTime = adjustTimeToLocal(kDate,tzOffset);
    //sconsole.log(adjustedTime);
    adjustedKeys[adjustedTime] = tempdata['data'][timeKeys[k]];
  }

  console.log(adjustedKeys);

  let filteredKeys = filterTime(adjustedKeys);
  console.log(filteredKeys);
  drawData(filteredKeys);

  //drawData(adjustedKeys);
}

//returns an integer representing the timezone offset in ms
function getTimeZoneOffset(date, tzO) {

  //convert to specific timezone
  let adjustedDate = date.toLocaleString('en-US', { timeZone: tzO });

  let offset = new Date(adjustedDate).getTime() - date.getTime();

  //console.log("timezone offset: " + offset + "ms");
  return offset;
}

//returns a date object
function adjustTimeToLocal(date, timeZoneOffset){

  let adjustedTime = date - timeZoneOffset;
  return new Date(adjustedTime);

}


function filterTime(data){
  let now = new Date().getTime();

  //filter by 72 hours (3 days * 24 hours * 60 minutes * 60 seconds * 1000 ms)
  let filter = duration;
  let cutOff = new Date(now-filter);

  let filteredData = [];
  //console.log(new Date(Object.keys(data)[0]).getTime());

  for (let d = 0; d < Object.keys(data).length; d++){
    let t = new Date(Object.keys(data)[d]);
    if(t.getTime() > cutOff){
      filteredData[Object.keys(data)[d]] = data[Object.keys(data)[d]];
    }
  }

  return filteredData;
}

function drawData(data){

  let k = Object.keys(data);
  let mostRecent = new Date(k[0]).getTime();
  let farthest = new Date(k[k.length - 1]).getTime();
  //console.log(new Date(mostRecent));

  for (let x=0;x < k.length; x++){
    let d = new Date(k[x]);
    drawX =map(d.getTime(), mostRecent, farthest, width-xMargin, xMargin);

    //width of rect
    if (x+1 < k.length){
      drawXw =map(new Date(k[x+1]).getTime(), mostRecent, farthest, width-xMargin, xMargin);
    } else {
      drawXw = xMargin;
    }
    drawY = map(data[k[x]],0.0, 50.0, height-yMargin, yMargin);
    drawColor = map(data[k[x]],0.0, 50.0, 0, 255);
    noStroke();
    fill(drawColor,1,1);
    rectMode(CORNERS);
    rect(drawX, drawY,drawXw, height - yMargin);
  }
  
}

function drawAxes(){
    //draw axes
    stroke(0,0,0);
    line(0 + xMargin, height - yMargin, 0 + xMargin, 0 + yMargin); // y axis
    line(0 + xMargin, height - yMargin, width - xMargin, height - yMargin); //x axis
}

function drawLabels(){

  let xAx = height - yMargin;
  let yAx = xMargin;

  fill(0);

  //AXIS
  textSize(40);
  textAlign(CENTER);
  //y axis
  push()
  translate(yAx - 20, height/2);
  rotate(PI*1.5);
  text("PV Power",0,0);
  pop();

  //x axis
  push()
    translate(width/2, (xAx) + 60);
    text("Local Time",0,0);
  pop();

  //TICKS
  textSize(20);

  //y ticks
  textAlign(RIGHT);
  line(xMargin-10,yMargin,xMargin+10,yMargin);
  text("50 watts",yAx-10,yMargin);

  line(xMargin-10,xAx,xMargin,xAx);
  text("0 watts",yAx-10, height - yMargin);

  //x ticks
  textAlign(RIGHT);
  line(width-xMargin,xAx-5,width-xMargin,xAx + 10);
  let timeNow = new Date();
  text(timeNow.toLocaleString(), width-xMargin,xAx + 25);

  textAlign(LEFT);
  line(xMargin,xAx-5,xMargin,xAx + 10);
  text(new Date(timeNow-duration).toLocaleString(),xMargin,xAx + 25);

  textAlign(CENTER);
  line((width-(2*xMargin))*.5,xAx-5,(width-(2*xMargin))*.5,xAx + 10);
  text(new Date(timeNow-(duration*.5)).toLocaleString(),(width-(2*xMargin))*.5,xAx + 25);

  textAlign(CENTER);
  line((width-(2*xMargin))*.25,xAx-5,(width-(2*xMargin))*.25,xAx + 10);
  text(new Date(timeNow-(duration*.25)).toLocaleString(),(width-(2*xMargin))*.25,xAx + 25);

  textAlign(CENTER);
  line((width-(2*xMargin))*.75,xAx-5,(width-(2*xMargin))*.75,xAx + 10);
  text(new Date(timeNow-(duration*.75)).toLocaleString(),(width-(2*xMargin))*.75,xAx + 25);
}






/*above only...*/

/*function gotVData(tempdata){
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
}*/

/*function gotCData(tempdata){
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
}*/

/*function drawData(name, data){
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

}*/
