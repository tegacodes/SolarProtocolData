# Using plotly.express
import plotly.express as px
import requests
import json
from json.decoder import JSONDecodeError
import os

apiDst = 'http://solarprotocol.net/api/v2/opendata.php?value=PV-power-L&duration=7'

def getData(url):
    try:
        x = requests.get(url,timeout=5)
        #print("API charge controller data:")
        #print(x.text)
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
    timeSeries = getData(apiDst)

    xTS = list(timeSeries['data'].keys())

    yVal = []
    
    for v in xTS:
        yVal.append(float(timeSeries['data'][v]))
    
    fig = px.bar(x=xTS, y=yVal, color=yVal, template="seaborn", title="PV Power",labels=dict(x="Time", y="PV Power"))
    fig.show()

    #lets save this image
    if not os.path.exists("images"):
        os.mkdir("images")

    fig.write_image("../images/fig1.png")

if __name__ == "__main__":
    main()

