from pathlib import Path
from PIL import Image, ImageDraw

files = sorted(Path("tmp/pdfs/manual-render").glob("page-*.png"))
tiles = []
for i, file in enumerate(files):
    im = Image.open(file).convert("RGB")
    im.thumbnail((310, 438))
    tile = Image.new("RGB", (330, 470), "white")
    tile.paste(im, ((330 - im.width) // 2, 22))
    ImageDraw.Draw(tile).text((8, 5), str(i + 1), fill="black")
    tiles.append(tile)

sheet = Image.new("RGB", (1320, ((len(tiles) + 3) // 4) * 470), (220, 225, 230))
for i, tile in enumerate(tiles):
    sheet.paste(tile, ((i % 4) * 330, (i // 4) * 470))
sheet.save("tmp/pdfs/manual-contact-sheet.jpg", quality=88)
print(len(files), sheet.size)
