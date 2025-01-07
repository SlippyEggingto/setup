import sys
from PIL import Image
from materialyoucolor.dynamiccolor.material_dynamic_colors import MaterialDynamicColors
from materialyoucolor.quantize import QuantizeCelebi
from materialyoucolor.hct import Hct
from materialyoucolor.scheme.scheme_tonal_spot import SchemeTonalSpot

wall = open("/home/nptanphuc/Downloads/wallpapers/wallpaper")
dak = open("/home/nptanphuc/Downloads/wallpapers/dark")
wallpaper = wall.readline()
dark = dak.readline()

isDark = False
if dark == "true" : isDark = True

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
    isDark, # False is light scheme
    0.0
)

f = open("/home/nptanphuc/.cache/wal/materialyoucolor-python.css", "w")
g = open("/home/nptanphuc/.cache/wal/materialyoucolor-python", "w")
h = open("/home/nptanphuc/.cache/wal/template-materialyoucolor-python", "w")
i = open("/home/nptanphuc/.cache/wal/hyprland-colors.conf", "w")
j = open("/home/nptanphuc/.cache/wal/std-materialyoucolor-python.css", "w")
j.write(":root {\n")

def decToHex(num):
    hex = f'{num:x}'
    if len(hex) < 2:
        hex = "0" + hex
    return hex


for color in vars(MaterialDynamicColors).keys():
    color_name = getattr(MaterialDynamicColors, color)
    if hasattr(color_name, "get_hct"):
        t = "@define-color " + str(color) + " rgb(" + str(color_name.get_hct(scheme).to_rgba()[0]) + ", " + str(color_name.get_hct(scheme).to_rgba()[1]) + ", " + str(color_name.get_hct(scheme).to_rgba()[2]) + ");\n"
        u = "#" + decToHex(color_name.get_hct(scheme).to_rgba()[0]) + decToHex(color_name.get_hct(scheme).to_rgba()[1]) + decToHex(color_name.get_hct(scheme).to_rgba()[2]) + "\n"
        v = decToHex(color_name.get_hct(scheme).to_rgba()[0]) + decToHex(color_name.get_hct(scheme).to_rgba()[1]) + decToHex(color_name.get_hct(scheme).to_rgba()[2])
        w = "$" + color + " = " + "rgb(" + v + ")\n"
        x = "    --" + color + ": #" + v + ";\n"
        f.write(t)
        v += "\n"
        g.write(u)
        h.write(v)
        i.write(w)
        j.write(x)

j.write("}")