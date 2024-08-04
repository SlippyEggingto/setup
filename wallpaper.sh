set wallpaper /home/$USER/Downloads/wallpapers/wall_13.jpg
#set waybar "waybar -s ~/.config/waybar/original.css -c ~/.config/waybar/original.jsonc"
set waybar waybar

rm ~/.config/hypr/hyprpaper.conf
touch ~/.config/hypr/hyprpaper.conf
echo "\$wallpaper = $wallpaper
preload = \$wallpaper
wallpaper = ,\$wallpaper" >> ~/.config/hypr/hyprpaper.conf

wal -i $wallpaper -q

rm /home/$USER/.cache/wal/hyprland-colors.conf
rm /home/$USER/.cache/wal/template-colors
touch /home/$USER/.cache/wal/hyprland-colors.conf
touch /home/$USER/.cache/wal/template-colors
echo "$(sed 's/#//g' /home/$USER/.cache/wal/colors)" >> /home/$USER/.cache/wal/template-colors

for i in (seq 1 16)
    echo "\$color$i = rgb($(sed "$i q;d" /home/$USER/.cache/wal/template-colors))" >> /home/$USER/.cache/wal/hyprland-colors.conf
end

rm ~/.cache/wal/colors-oomox
touch ~/.cache/wal/colors-oomox
echo "NAME=wal
BG=$(sed "1q;d" ~/.cache/wal/template-colors)
FG=$(sed "16q;d" ~/.cache/wal/template-colors)
MENU_BG=$(sed "1q;d" ~/.cache/wal/template-colors)
MENU_FG=$(sed "16q;d" ~/.cache/wal/template-colors)
SEL_BG=$(sed "5q;d" ~/.cache/wal/template-colors)
SEL_FG=ffffff
TXT_BG=$(sed "1q;d" ~/.cache/wal/template-colors)
TXT_FG=$(sed "16q;d" ~/.cache/wal/template-colors)
BTN_BG=$(sed "1q;d" ~/.cache/wal/template-colors)
BTN_FG=$(sed "16q;d" ~/.cache/wal/template-colors)
HDR_BG=$(sed "1q;d" ~/.cache/wal/template-colors)
HDR_FG=$(sed "16q;d" ~/.cache/wal/template-colors)
GTK3_GENERATE_DARK=True
ROUNDNESS=12
SPACING=3
GRADIENT=0.0" >> ~/.cache/wal/colors-oomox

oomox-cli ~/.cache/wal/colors-oomox

killall waybar
killall hyprpaper
hyprctl dispatch exec $waybar
hyprctl dispatch exec hyprpaper
