# wallpaper=/home/nptanphuc/Downloads/wallpapers/wall_1.jpg
set wallpaper /home/nptanphuc/Downloads/wallpapers/wall_1.jpg

rm ~/.config/fish/config.fish
touch ~/.config/fish/config.fish
echo "bind \e\[1\;5C forward-word
bind \e\[1\;5D backward-word

wal -i $wallpaper

if status is-interactive
    set fish_greeting
end" >> ~/.config/fish/config.fish

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

sleep 1

wal -i $wallpaper
kill waybar
kill hyprpaper
hyprctl dispatch exec waybar
hyprctl dispatch exec hyprpaper
