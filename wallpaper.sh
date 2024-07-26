set wallpaper /home/$USER/Downloads/wallpapers/wall_10.jpg
#set waybar "waybar -s ~/.config/waybar/original.css -c ~/.config/waybar/original.jsonc"
set waybar waybar

rm ~/.config/hypr/hyprpaper.conf
touch ~/.config/hypr/hyprpaper.conf
echo "preload = $wallpaper
wallpaper = ,$wallpaper" >> ~/.config/hypr/hyprpaper.conf

rm ~/.config/swaylock/config
touch ~/.config/swaylock/config
echo "indicator
ignore-empty-password
indicator-thickness=15
indicator-radius=150
image=$wallpaper
clock
effect-blur=7x5
effect-vignette=0.5:0.5
ring-color=786bcc
key-hl-color=bcb2ff
line-color=00000000
inside-color=00000088
inside-clear-color=00000088
text-color=cccccc
text-clear-color=daa520
ring-clear-color=bcb2ff
separator-color=00000000
grace=0
fade-in=0.5" >> ~/.config/swaylock/config

wal -i $wallpaper -q
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