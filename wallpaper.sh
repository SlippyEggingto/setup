set wallpaper /home/$USER/Downloads/wallpapers/wall_29.jpg
#set waybar "waybar -s ~/.config/waybar/original.css -c ~/.config/waybar/original.jsonc"
set waybar waybar

rm ~/.config/hypr/hyprpaper.conf
touch ~/.config/hypr/hyprpaper.conf
echo "\$wallpaper = $wallpaper
preload = \$wallpaper
wallpaper = ,\$wallpaper" >> ~/.config/hypr/hyprpaper.conf

wal -i $wallpaper -q

sed -i '15s/0/12/' ~/.cache/wal/colors-oomox
oomox-cli ~/.cache/wal/colors-oomox

killall waybar
killall hyprpaper
hyprctl dispatch exec $waybar
hyprctl dispatch exec hyprpaper

rm /home/$USER/.cache/wal/hyprland-colors.conf
rm /home/$USER/.cache/wal/template-colors
touch /home/$USER/.cache/wal/hyprland-colors.conf
touch /home/$USER/.cache/wal/template-colors
echo "$(sed 's/#//g' /home/$USER/.cache/wal/colors)" >> /home/$USER/.cache/wal/template-colors

for i in (seq 1 16)
    echo "\$color$i = rgb($(sed "$i q;d" /home/$USER/.cache/wal/template-colors))" >> /home/$USER/.cache/wal/hyprland-colors.conf
end
