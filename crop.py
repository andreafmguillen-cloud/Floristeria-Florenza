from PIL import Image

img = Image.open('logo.png')
# Crop only the bottom part where the text is, leave the sides and top alone
box = (0, 0, 1024, 580)
cropped = img.crop(box)
cropped.save('logo_flower.png')
