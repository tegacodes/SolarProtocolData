"""
This example pulls the value of one energy parameter from the current active server in the Solar Protocol network.
"""

import gizeh as gz
import numpy as np
import requests
import json
from json.decoder import JSONDecodeError
from datetime import datetime

# DATA PARAMETERS
L = 600 # Image dimension

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

def drawData(name, data):
    #find max value of the parameter
    # maxVal = max()
    # print(maxVal)

    #find minimum and maximum time stamps


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
    print(real_data)

    #drawData(param, real_data)

    # INITIALIZE THE SURFACE
    surface = gz.Surface(L,L, bg_color=(1,1,1))

    txt = gz.text(param, fontfamily="Impact",  fontsize=40, fill=(0,0,0), xy=(20,60))
    txt.draw(surface)

    # SAVE
    surface.write_to_png("single-value.png")

if __name__ == "__main__":
    main()
