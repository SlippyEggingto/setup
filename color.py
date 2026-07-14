import sys
from PIL import Image
from materialyoucolor.dynamiccolor.material_dynamic_colors import MaterialDynamicColors
from materialyoucolor.quantize import QuantizeCelebi
from materialyoucolor.hct import Hct
from materialyoucolor.scheme.scheme_tonal_spot import SchemeTonalSpot

with open("/home/nptanphuc/Personalization/wallpaper") as f:
    wallpaper = f.readline().strip()
with open("/home/nptanphuc/Personalization/color_scheme") as f:
    dark = f.readline().strip == "dark"
with open("/home/nptanphuc/Personalization/light_bar") as f:
    light_bar = f.readline().strip == "true"

image = Image.open(wallpaper)
pixel_len = image.width * image.height
image_data = image.getdata()
quality = 10
pixel_array = [image_data[_] for _ in range(0, pixel_len, quality)]

result = QuantizeCelebi(pixel_array, 1)
seed_color = list(result.keys())[0]

scheme = SchemeTonalSpot(
    Hct.from_int(seed_color),
    dark == False,
    0.0
)

def get_hex_from_rgba(rgba):
    r, g, b = rgba[:3]
    return f"{r:02x}{g:02x}{b:02x}"

def make_bright_hct(hct_color, tone_step = 30):
    current_tone = hct_color.tone
    new_tone = min(current_tone + tone_step, 95)
    return Hct.from_hct(hct_color.hue, hct_color.chroma, new_tone)

file_paths = {
    "x": "/home/nptanphuc/Personalization/type1",       #   abcdef
    "y": "/home/nptanphuc/Personalization/type2",       #   #abcdef
    "z": "/home/nptanphuc/Personalization/type3.css",   #   :root {-var: ;}
    "k": "/home/nptanphuc/Personalization/type5",       #   $var=#abcdef

    "x2": "/home/nptanphuc/Personalization/type12",
    "y2": "/home/nptanphuc/Personalization/type22",
    "z2": "/home/nptanphuc/Personalization/type32.css",
    "k2": "/home/nptanphuc/Personalization/type52",
}

if not light_bar:
    file_paths.update({"t": "/home/nptanphuc/Personalization/type4.css"})       #   @define-color
    file_paths.update({"t2": "/home/nptanphuc/Personalization/type42.css"})

from contextlib import ExitStack

with ExitStack() as stack:
    files = {key: stack.enter_context(open(path, "w")) for key, path in file_paths.items()}

    css_root_regular = ":root {\n"
    css_root_bright = ":root {\n"

    for color_attr in vars(MaterialDynamicColors).keys():
        color_name = getattr(MaterialDynamicColors, color_attr)

        if hasattr(color_name, "get_hct"):
            reg_hct = color_name.get_hct(scheme)
            reg_hex = get_hex_from_rgba(reg_hct.to_rgba())

            bright_hct = make_bright_hct(reg_hct)
            bright_hex = get_hex_from_rgba(bright_hct.to_rgba())

            files["x"].write(f"{reg_hex}\n")
            files["y"].write(f"#{reg_hex}\n")
            files["k"].write(f"${color_attr}=0xff{reg_hex}\n")
            css_root_regular += f"    --{color_attr}: #{reg_hex};\n"

            if not light_bar:
                files["t"].write(f"@define-color {color_attr} #{reg_hex}\n")

            files["x2"].write(f"{bright_hex}\n")
            files["y2"].write(f"#{bright_hex}\n")
            files["k2"].write(f"${color_attr}=0xff{bright_hex}\n")
            css_root_bright += f"    --{color_attr}: #{bright_hex};\n"

            if not light_bar:
                files["t2"].write(f"@define-color {color_attr} #{bright_hex};\n")

    css_root_regular += "}"
    css_root_bright += "}"
    files["z"].write(css_root_regular)
    files["z2"].write(css_root_bright)