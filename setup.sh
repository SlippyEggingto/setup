#!/bin/bash

cd ~
mkdir -p ~/Desktop
mkdir -p ~/Downloads
mkdir -p ~/Documents
mkdir -p ~/Pictures/Screenshots

sudo pacman -Syu
sudo pacman -S firefox hyprland hyprpaper waybar neovim nwg-look foot fish ttf-nerd-fonts-symbols-mono ntfs-3g wofi python-pywal cliphist nautilus neofetch brightnessctl vulkan-intel vulkan-tools htop tree

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

sudo mkdir -p /media/nptanphuc
sudo mount /dev/sda2 /media/nptanphuc
sudo mkdir -p /usr/local/share/fonts/WindowsFonts
sudo cp /media/nptanphuc/Windows/Fonts/* /usr/local/share/fonts/WindowsFonts
fc-cache --force

# sudo echo "UUID=F0C2F863C2F83008 	/media/nptanphuc	ntfs-3g		uid=1000,gid=1000,umask=0022,sync,auto,nosuid,rw,nouser 0 0" >> /etc/fstab

ln -s /media/nptanphuc/Users/HP/Desktop/ ~/Desktop
git clone https://github.com/NvChad/starter ~/.config/nvim
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

cd ~
yay -S visual-studio-code-bin ibus-bamboo wlogout swaylock-effects hyprshot hyprpicker yaru-icon-theme bibata-cursor-theme

# sudo dd if=/dev/zero of=/SWAP.img bs=1M count=8192
# sudo sync
# sudo chmod 600 /SWAP.img
# sudo mkswap /SWAP.img
# sudo swapon /SWAP.img
# sudo echo "/SWAP.img none swap sw 0 0" >> /etc/fstab

sh wallpaper.sh
echo "===== Setup was completed. Reboot is required. ====="