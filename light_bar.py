import sys
from PIL import Image
from materialyoucolor.dynamiccolor.material_dynamic_colors import MaterialDynamicColors
from materialyoucolor.quantize import QuantizeCelebi
from materialyoucolor.hct import Hct
from materialyoucolor.scheme.scheme_tonal_spot import SchemeTonalSpot

wall = open("/home/nptanphuc/Downloads/wallpapers/wallpaper")
wallpaper = wall.readline()


image = Image.open(wallpaper)
pixel_len = image.width * image.height
image_data = image.getdata()
quality = 10
pixel_array = [image_data[_] for _ in range(0, pixel_len, quality)]

result = QuantizeCelebi(pixel_array, 1)

color = 0

for key, value in result.items():
    color = key

scheme = SchemeTonalSpot(
    Hct.from_int(color),
    False,
    0.0
)

f = open("/home/nptanphuc/.cache/wal/materialyoucolor-python.css", "w")

for color in vars(MaterialDynamicColors).keys():
    color_name = getattr(MaterialDynamicColors, color)
    if hasattr(color_name, "get_hct"):
        t = "@define-color " + str(color) + " rgb(" + str(color_name.get_hct(scheme).to_rgba()[0]) + ", " + str(color_name.get_hct(scheme).to_rgba()[1]) + ", " + str(color_name.get_hct(scheme).to_rgba()[2]) + ");\n"
        f.write(t)
