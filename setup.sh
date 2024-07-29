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

sudo pacman -Syu
sudo pacman -S hyprland-git hyprpaper-git waybar-git neovim foot fish ttf-nerd-fonts-symbols-mono wofi python-pywal cliphist nautilus brightnessctl wlogout swaylock-effects hyprshot-git hyprpicker-git firefox vulkan-intel vulkan-tools neofetch htop tree ntfs-3g yay xdg-desktop-portal-gtk xdg-desktop-portal-hyprland-git bibata-cursor-theme yaru-icon-theme

ln -s ~/setup/wallpapers ~/Downloads
rm -rf ~/.config/hypr
ln -s ~/setup/hypr ~/.config/
ln -s ~/setup/waybar ~/.config
ln -s ~/setup/wlogout ~/.config
ln -s ~/setup/swaylock ~/.config
ln -s ~/setup/wofi ~/.config
ln -s ~/setup/foot ~/.config
ln -s ~/setup/wallpaper.sh ~

sudo rm /usr/share/icons/default/index.theme
sudo ln -s ~/setup/index.theme /usr/share/icons/default

mkdir -p ~/.config/fish
rm ~/.config/fish/config.fish
touch ~/.config/fish/config.fish
echo "set fish_greeting
alias nvim="nvim +'hi Normal ctermbg=none guibg=none' +'set expandtab ts=4 sw=4 ai'"
cat ~/.cache/wal/sequences &" >> ~/.config/fish/config.fish

echo "export HYPRSHOT_DIR=~/Pictures/Screenshots/" >> ~/.bash_profile

mkdir -p ~/.config/xdg-desktop-portal/
rm ~/.config/xdg-desktop-portal/hyprland-portals.conf
touch ~/.config/xdg-desktop-portal/hyprland-portals.conf
echo "[preferred]
default=hyprland;gtk
org.freedesktop.impl.portal.FileChooser=gtk" >> ~/.config/xdg-desktop-portal/hyprland-portals.conf

sudo rm ~/.config/gtk-3.0/settings.ini
touch ~/.config/gtk-3.0/settings.ini
echo "[Settings]
gtk-theme-name=Adwaita
gtk-icon-theme-name=Yaru
gtk-font-name=Cantarell 11
gtk-cursor-theme-name=Bibata-Modern-Classic
gtk-cursor-theme-size=24
gtk-toolbar-style=GTK_TOOLBAR_ICONS
gtk-toolbar-icon-size=GTK_ICON_SIZE_LARGE_TOOLBAR
gtk-button-images=0
gtk-menu-images=0
gtk-enable-event-sounds=1
gtk-enable-input-feedback-sounds=0
gtk-xft-antialias=1
gtk-xft-hinting=1
gtk-xft-hintstyle=hintslight
gtk-xft-rgba=rgb
gtk-application-prefer-dark-theme=1" >>  ~/.config/gtk-3.0/settings.ini

sudo rm ~/.gtkrc-2.0
touch ~/.gtkrc-2.0
echo "include "/home/nptanphuc/.gtkrc-2.0.mine"
gtk-theme-name="Adwaita"
gtk-icon-theme-name="Yaru"
gtk-font-name="Cantarell 11"
gtk-cursor-theme-name="Bibata-Modern-Classic"
gtk-cursor-theme-size=24
gtk-toolbar-style=GTK_TOOLBAR_ICONS
gtk-toolbar-icon-size=GTK_ICON_SIZE_LARGE_TOOLBAR
gtk-button-images=0
gtk-menu-images=0
gtk-enable-event-sounds=1
gtk-enable-input-feedback-sounds=0
gtk-xft-antialias=1
gtk-xft-hinting=1
gtk-xft-hintstyle="hintslight"
gtk-xft-rgba="rgb"" >> ~/.gtkrc-2.0

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

cd ~/.mozilla/firefox/*default-release*/
mkdir -p chrome/
ln -s ~/setup/userChrome.css chrome/
cd ~

# sudo echo "UUID=F0C2F863C2F83008 	/media/nptanphuc	ntfs-3g		uid=1000,gid=1000,umask=0022,sync,auto,nosuid,rw,nouser 0 0" >> /etc/fstab

# sudo dd if=/dev/zero of=/SWAP.img bs=1M count=8192
# sudo sync
# sudo chmod 600 /SWAP.img
# sudo mkswap /SWAP.img
# sudo swapon /SWAP.img
# sudo echo "/SWAP.img none swap sw 0 0" >> /etc/fstab

echo "===== Setup was completed. Reboot is required. ====="
