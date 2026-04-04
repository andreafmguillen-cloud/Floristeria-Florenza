import os
try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("rembg or PIL not installed.")
    exit(1)

for file in ["birthdayb.jpg", "bouquet.jpg"]:
    if not os.path.exists(file):
        print(f"File {file} not found.")
        continue
    try:
        input_image = Image.open(file)
        # convert to RGB just in case
        if input_image.mode != "RGB":
            input_image = input_image.convert("RGB")
        output_image = remove(input_image)
        # We can crop the transparent background slightly or leave it. rembg usually trims reasonably or keeps original size.
        out_name = file.replace(".jpg", "_nobg.png")
        output_image.save(out_name)
        print(f"Processed {file} -> {out_name}")
    except Exception as e:
        print(f"Error processing {file}: {e}")
