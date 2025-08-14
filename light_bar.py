import sys
from PIL import Image
from materialyoucolor.dynamiccolor.material_dynamic_colors import MaterialDynamicColors
from materialyoucolor.quantize import QuantizeCelebi
from materialyoucolor.hct import Hct
from materialyoucolor.scheme.scheme_tonal_spot import SchemeTonalSpot

wall = open("/home/nptanphuc/Personalization/wallpaper")
wallpaper = wall.readline().replace("\n", "")

dark = False

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
    dark, # False is light scheme
    0.0
)

t = open("/home/nptanphuc/Personalization/type4.css", "w")  #     @define-color

def decToHex(num):
    if num>255: return "ff"
    hex = f'{num:x}'
    if len(hex) < 2:
        hex = "0" + hex
    return hex


t3 = ":root {\n"


for color in vars(MaterialDynamicColors).keys():
    color_name = getattr(MaterialDynamicColors, color)
    if hasattr(color_name, "get_hct"):
        t4 = "@define-color " + str(color) + " #" + decToHex(color_name.get_hct(scheme).to_rgba()[0]) + decToHex(color_name.get_hct(scheme).to_rgba()[1]) + decToHex(color_name.get_hct(scheme).to_rgba()[2]) + ";\n"

        t.write(t4)
