#!/bin/bash

cd ~
mkdir -p ~/Desktop
mkdir -p ~/Downloads
mkdir -p ~/Documents
mkdir -p ~/Pictures/Screenshots

sudo rm /etc/pacman.conf
sudo ln -s ~/setup/pacman.conf /etc

sudo rm /etc/pacman.d/mirrorlist
sudo ln -s ~/setup/mirrorlist /etc/pacman.d

sudo pacman -Syyuu
sudo pacman -S hyprland hyprpaper waybar neovim nwg-look foot fish ttf-nerd-fonts-symbols-mono wofi python-pywal cliphist nautilus brightnessctl wlogout swaylock-effects hyprshot hyprpicker mako google-chrome vulkan-intel vulkan-tools neofetch htop tree ntfs-3g yay xdg-desktop-portal-gtk xdg-desktop-portal-hyprland

ln -s ~/setup/wallpapers ~/Downloads
rm -rf ~/.config/hypr
ln -s ~/setup/hypr ~/.config/
ln -s ~/setup/waybar ~/.config
ln -s ~/setup/wlogout ~/.config
ln -s ~/setup/swaylock ~/.config
ln -s ~/setup/wofi ~/.config
ln -s ~/setup/foot ~/.config
ln -s ~/setup/wallpaper.sh ~
ln -s ~/setup/mako ~/.config
mkdir -p ~/.config/fish
touch ~/.config/fish/config.fish
echo "set fish_greeting
alias nvim="nvim +'hi Normal ctermbg=none guibg=none' +'set expandtab ts=4 sw=4 ai'"
cat ~/.cache/wal/sequences &" >> ~/.config/fish/config.fish
echo "export HYPRSHOT_DIR=~/Pictures/Screenshots/" >> ~/.bash_profile
mkdir -p ~/.config/xdg-desktop-portal/
touch ~/.config/xdg-desktop-portal/hyprland-portals.conf
echo "[preferred]
default=hyprland;gtk
org.freedesktop.impl.portal.FileChooser=gtk" >> ~/.config/xdg-desktop-portal/hyprland-portals.conf

sudo mkdir -p /media/nptanphuc
sudo mount /dev/sda2 /media/nptanphuc
sudo mkdir -p /usr/local/share/fonts/WindowsFonts
sudo cp /media/nptanphuc/Windows/Fonts/* /usr/local/share/fonts/WindowsFonts
fc-cache --force

ln -s /media/nptanphuc/Users/HP/Desktop/ ~/Desktop
git clone https://github.com/NvChad/starter ~/.config/nvim

fish wallpaper.sh

git config --global user.name "SlippyEggingto"
git config --global user.email "phamtanphucnguyen@gmail.com"
#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

# sudo echo "UUID=F0C2F863C2F83008 	/media/nptanphuc	ntfs-3g		uid=1000,gid=1000,umask=0022,sync,auto,nosuid,rw,nouser 0 0" >> /etc/fstab

# sudo dd if=/dev/zero of=/SWAP.img bs=1M count=8192
# sudo sync
# sudo chmod 600 /SWAP.img
# sudo mkswap /SWAP.img
# sudo swapon /SWAP.img
# sudo echo "/SWAP.img none swap sw 0 0" >> /etc/fstab

echo "===== Setup was completed. Reboot is required. ====="