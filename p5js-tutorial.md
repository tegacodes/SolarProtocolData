### P5JS (client side rendering)
- Javascript using the P5 library. [https://p5js.org/](https://p5js.org/)
- If running your code from a local server, access the network data direct from the Solar Protocol API at [http://solarprotocol.net/api/v2/](http://solarprotocol.net/api/v1/). If developing in an online editor, you will need to use the development server to access network data due to the [Cross-Origin Resource Sharing standard](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors) that will block http requests from https servers. Development server is here: [https://server.solarpowerforartists.com](https://server.solarpowerforartists.com/)


### Install p5.js:
- Either download the [library and run a server locally](https://p5js.org/download/)
- Or use the [online editor](https://editor.p5js.org/)

#### Example: 0-single-value
- Access a single data point from the server
- [See example online.](https://editor.p5js.org/brain/sketches/hVA39SS-c)

To access the data, [loadJSON()](https://p5js.org/reference/#/p5/loadJSON) is used with a callback function called gotData. 

```
loadJSON(URL, gotData); 
```

#### Example: 1-value-duration
- Work with the timeseries of a charge controller parameter like current or voltage. 
- [See example online.](https://editor.p5js.org/brain/sketches/VSCXfAwJ6)

- Uses day.js library to deal with dates and timestamps: [https://day.js.org/en/](https://day.js.org/en/)

![alt text](images/voltage-current-timeseries.png)

#### Example: 2-cc-data
- Visualize the timeseries of all charge controller parameters
- [See example online.](https://editor.p5js.org/brain/sketches/TThNw8pbk)

- Uses day.js library to deal with dates and timestamps: [https://day.js.org/en/](https://day.js.org/en/)

![alt text](images/all-params-timeseries.png)
