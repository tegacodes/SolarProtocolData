"""
This example graphs energy parameters through time from current active server in the Solar Protocol network.
Preview data: http://solarprotocol.net/api/v2/opendata.php?value=PV-voltage&duration=2 
"""

import gizeh as gz
import numpy as np
import requests
import json
from json.decoder import JSONDecodeError
from datetime import datetime

# DATA PARAMETERS
w = 600 # Image dimension
h = 400

param = "PV-voltage"
baseURL = 'http://solarprotocol.net/api/v2/opendata.php?value='
offLineData = "../../data/0-single-value.json"

days = 2
ccValue = "PV-voltage"

# GRAPH PARAMETERS
yMargin = 50
xMargin = 50

pd = 0
ph = 0
v = 0
colors = ["blue", "red", "green", "yellow", "pink", "orange", "purple"]
c=0; #color counter

maxVal = 25


def getCCData(ccValue):
    try:
        x = requests.get(baseURL+ccValue + "&duration="+str(days),timeout=5)
        print("API charge controller data:")
        print(x.text)
        x.json()
        return json.loads(x.text) #parse json as Python list
    except JSONDecodeError as errj:
        print("A JSON decode error:" + repr(errj))
    except requests.exceptions.HTTPError as errh:
        print("An Http Error occurred:" + repr(errh))
    except requests.exceptions.ConnectionError as errc:
        print("An Error Connecting to the API occurred:" + repr(errc))
    except requests.exceptions.Timeout as errt:
        print("A Timeout Error occurred:" + repr(errt))
    except requests.exceptions.RequestException as err:
        print("An Unknown Error occurred" + repr(err))

def remap(value, leftMin, leftMax, rightMin, rightMax):
    # Figure out how 'wide' each range is
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin

    # Convert the left range into a 0-1 range (float)
    valueScaled = float(value - leftMin) / float(leftSpan)

    # Convert the 0-1 range into a value in the right range.
    return rightMin + (valueScaled * rightSpan)

def drawData(name, data, _surface):
    #find max value of the parameter
    # maxVal = max()
    # print(maxVal)

    #find minimum and maximum time stamps
    minDate = data[0]["date"].timestamp()
    print(minDate)

    maxDate = data[-1]["date"].timestamp()
    print(maxDate)
    px = xMargin
    py = h - yMargin

    for item in data:
        #print(item["date"].timestamp())
        y = remap(item["val"], 0, maxVal, h - yMargin, 0 + yMargin)
        x = remap(item["date"].timestamp(), minDate, maxDate, xMargin, w - xMargin)
        circ = gz.circle(r=1, xy=(x, y), fill=(1,0,1))
        circ.draw(_surface)

def drawAxes(_surface):
    yAxis = gz.polyline(points=[(0 + xMargin, h - yMargin), (0 + xMargin, 0 + yMargin)], stroke_width=1, stroke=(0,0,0), fill=(0,0,0))
    yAxis.draw(_surface)
    xAxis = gz.polyline(points=[(0 + xMargin, h - yMargin), (w - xMargin, h - yMargin)], stroke_width=1, stroke=(0,0,0), fill=(0,0,0))
    xAxis.draw(_surface)

def main():
    #GET DATA
    getResult = getCCData("PV-voltage")

    #GET VALUES FROM DATA
    param = list(getResult["header"].values())[0]
    print(param)

    #PUT DATA INTO AN ARRAY AND SORT BY DATE
    real_data = []

    for key, val in getResult["data"].items():
        item = {"date": datetime.strptime(key, "%Y-%m-%d %H:%M:%S.%f"), "val": float(val)}
        real_data.append(item)

    real_data = sorted(real_data, key=lambda k: k["date"])
    #print(real_data)



    # INITIALIZE THE SURFACE
    surface = gz.Surface(w, h, bg_color=(1,1,1))

    txt = gz.text(param, fontfamily="Times",  fontsize=12, fill=(0,0,0), xy=(w/2, 40))
    txt.draw(surface)

    drawAxes(surface)
    drawData(param, real_data, surface)

    # SAVE
    surface.write_to_png("value-duration.png")

if __name__ == "__main__":
    main()
