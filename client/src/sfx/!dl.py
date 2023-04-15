import requests
import time

for i in range(1, 100):
    print(i)

    image_url = "https://pokemoncries.com/cries/" + str(i) + ".mp3"
    img_data = requests.get(image_url).content
    with open(str(i) + '.mp3', 'wb') as handler:
        handler.write(img_data)
    time.sleep(1)
    