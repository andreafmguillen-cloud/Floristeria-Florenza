from PIL import Image

img = Image.open('logo.png')
box = (100, 100, 924, 650)
cropped = img.crop(box)
cropped.save('logo_flower.png')
