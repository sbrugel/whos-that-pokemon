import requests
import time

for i in range(535, 900):
    print(i)

    image_url = "https://pokemoncries.com/pokemon-images/" + str(i) + ".png"
    img_data = requests.get(image_url).content
    with open(str(i) + '.png', 'wb') as handler:
        handler.write(img_data)
    time.sleep(1)

for i in range(100, 900):
    print(i)

    image_url = "https://pokemoncries.com/cries/" + str(i) + ".mp3"
    img_data = requests.get(image_url).content
    with open(str(i) + '.mp3', 'wb') as handler:
        handler.write(img_data)
    time.sleep(1)
    