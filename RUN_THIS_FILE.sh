#!/bin/bash

cd ~
mkdir -p ~/Desktop
mkdir -p ~/Downloads
mkdir -p ~/Documents
mkdir -p ~/Pictures/Screenshots

sudo pacman -Syu
sudo pacman -S hyprland hyprpaper waybar foot fish ttf-nerd-fonts-symbols-mono wofi python-pywal cliphist neofetch brightnessctl

ln -s ~/setup/wallpapers ~/Downloads
rm -rf ~/.config/hypr
ln -s ~/setup/hypr ~/.config/
ln -s ~/setup/waybar ~/.config
ln -s ~/setup/wlogout ~/.config
ln -s ~/setup/swaylock ~/.config
ln -s ~/setup/wofi ~/.config
ln -s ~/setup/foot ~/.config
ln -s ~/setup/wallpaper.sh ~
mkdir -p ~/.config/fish
touch ~/.config/fish/config.fish
echo "set fish_greeting
alias nvim="nvim +'hi Normal ctermbg=none guibg=none' +'set expandtab ts=4 sw=4 ai'"
cat ~/.cache/wal/sequences &" >> ~/.config/fish/config.fish
echo "export HYPRSHOT_DIR=~/Pictures/Screenshots/" >> ~/.bash_profile

git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

cd ~
yay -S wlogout swaylock-effects hyprshot hyprpicker yaru-icon-theme bibata-cursor-theme
sh wallpaper.sh
echo "===== Completed. Reboot. ====="