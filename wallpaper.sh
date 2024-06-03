set wallpaper /home/$USER/Downloads/wallpapers/wall_13.jpg

rm ~/.config/hypr/hyprpaper.conf
touch ~/.config/hypr/hyprpaper.conf
echo "preload = $wallpaper
wallpaper = eDP-1,$wallpaper" >> ~/.config/hypr/hyprpaper.conf

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

wal -i $wallpaper
killall waybar
killall hyprpaper
hyprctl dispatch exec waybar
hyprctl dispatch exec hyprpaper
