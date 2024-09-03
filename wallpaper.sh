wallpaper="/home/$USER/Downloads/wallpapers/wall_35.png"
#set waybar "waybar -s ~/.config/waybar/original.css -c ~/.config/waybar/original.jsonc"
waybar=waybar

rm ~/.config/hypr/hyprpaper.conf
touch ~/.config/hypr/hyprpaper.conf
echo "\$wallpaper = $wallpaper
preload = \$wallpaper
wallpaper = ,\$wallpaper" >> ~/.config/hypr/hyprpaper.conf

wal -i $wallpaper -q

sed -i -E "s/#.*?/$(sed '5q;d' ~/.cache/wal/colors)/" ~/setup/mako/config
makoctl reload
notify-send "Changing colorscheme and wallpaper"

rm /home/$USER/.cache/wal/hyprland-colors.conf
rm /home/$USER/.cache/wal/template-colors
touch /home/$USER/.cache/wal/hyprland-colors.conf
touch /home/$USER/.cache/wal/template-colors
echo "$(sed 's/#//g' /home/$USER/.cache/wal/colors)" >> /home/$USER/.cache/wal/template-colors

for i in $(seq 1 16)
do
    echo "\$color$i = rgb($(sed "$i q;d" /home/$USER/.cache/wal/template-colors))" >> /home/$USER/.cache/wal/hyprland-colors.conf
done

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

notify-send "Colorscheme and wallpaper changed" "Wallpaper: $wallpaper\n"
