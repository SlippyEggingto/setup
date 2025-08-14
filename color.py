import sys
from PIL import Image
from materialyoucolor.dynamiccolor.material_dynamic_colors import MaterialDynamicColors
from materialyoucolor.quantize import QuantizeCelebi
from materialyoucolor.hct import Hct
from materialyoucolor.scheme.scheme_tonal_spot import SchemeTonalSpot

wall = open("/home/nptanphuc/Personalization/wallpaper")
dak = open("/home/nptanphuc/Personalization/color_scheme")
ligbar = open("/home/nptanphuc/Personalization/light_bar")
wallpaper = wall.readline().replace("\n", "")
dark = dak.readline().replace("\n", "")
light_bar = ligbar.readline().replace("\n", "")

if (dark == "dark"):
    dark = True
else:
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

x = open("/home/nptanphuc/Personalization/type1", "w")                                  #     abcdef
y = open("/home/nptanphuc/Personalization/type2", "w")                                  #     #abcdef
z = open("/home/nptanphuc/Personalization/type3.css", "w")                              #     :root {-var: ;}
if (light_bar == "false"): t = open("/home/nptanphuc/Personalization/type4.css", "w")   #     @define-color
k = open("/home/nptanphuc/Personalization/type5", "w")                                  #     $var=#abcdef

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
        t0 = decToHex(color_name.get_hct(scheme).to_rgba()[0]) + decToHex(color_name.get_hct(scheme).to_rgba()[1]) + decToHex(color_name.get_hct(scheme).to_rgba()[2])
        t1 = t0 + "\n"
        t2 = "#" + t0 + "\n"
        t3 += "    --" + str(color) + ": #" + t0 + ";\n"
        if (light_bar == "false"): t4 = "@define-color " + str(color) + " #" + t0 + ";\n"
        t5 = "$" + str(color) + "=0xff" + t0 + "\n"

        x.write(t1)
        y.write(t2)
        if (light_bar == "false"): t.write(t4)
        k.write(t5)

t3 += "}"
z.write(t3)