import requests
import time

for i in range(45, 100):
    print(i)

    image_url = "https://pokemoncries.com/pokemon-images/" + str(i) + ".png"
    img_data = requests.get(image_url).content
    with open(str(i) + '.png', 'wb') as handler:
        handler.write(img_data)
    time.sleep(1)
    