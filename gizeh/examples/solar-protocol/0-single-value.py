"""
This example pulls the value of one energy parameter from the current active server in the Solar Protocol network.
It then displays it using the Gizeh python library: 
"""

import gizeh as gz
import requests
import json
from json.decoder import JSONDecodeError

# PARAMETERS

param = "PV-voltage"
baseURL = 'http://solarprotocol.net/api/v2/opendata.php?value='
offLineData = "../../data/0-single-value.json"

ccValue = "PV-voltage"

Pi = 3.14

L = 200 # Image dimension

# FUNCTIONS

def getCCData(ccValue):
    try:
        x = requests.get(baseURL+ccValue,timeout=5)
        print("API charge controller data:")
        print(x.text)
        x.json()
        return json.loads(x.text)
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

def main():
    #GET DATA
    getResult = getCCData("PV-voltage")

    #GET VALUES FROM DATA
    name = list(getResult.keys())[0]
    param = list(getResult.values())[0]

    # INITIALIZE THE SURFACE
    surface = gz.Surface(L,L, bg_color=(1,0,1))

    # DRAW THE TEXT
    txt = gz.text(param, fontfamily="Impact",  fontsize=20, fill=(0,0,0), xy=(100,50), angle=Pi/12)
    txt.draw(surface)

    txt2 = gz.text(name, fontfamily="Impact",  fontsize=20, fill=(0,0,0), xy=(100,80), angle=Pi/12)
    txt2.draw(surface)

    # SAVE
    surface.write_to_png("single-value.png")

if __name__ == "__main__":
    main()

