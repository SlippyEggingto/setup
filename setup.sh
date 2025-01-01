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
sudo pacman -S hyprland-git hyprpaper-git waybar-git neovim foot fish ttf-nerd-fonts-symbols-mono wofi python-pywal cliphist brightnessctl wlogout hyprlock-git hyprpicker-git hyprshot themix-full-git mako eww-git nemo firefox vulkan-intel vulkan-tools neofetch htop tree ntfs-3g yay xdg-desktop-portal-gtk xdg-desktop-portal-hyprland-git bibata-cursor-theme ibus ibus-bamboo-git cmus polkit-kde-agent qt5-wayland qt6-wayland visual-studio-code-bin keyd socat swww typescript npm meson gjs gnome-bluetooth-3.0 upower gobject-introspection libdbusmenu-gtk3 libsoup3 glib2 glib2-devel yaru-icon-theme

git clone https://github.com/yeyushengfan258/Win11-icon-theme.git ~/Win11-icon-theme/
cd ~/Win11-icon-theme
bash ./install.sh
cd ~
sudo rm -rf ~/Win11-icon-theme

git clone https://github.com/Aylur/ags.git -b v1 ~/ags
cd ~/ags
npm install
meson setup build
meson install -C build
cd ~
sudo rm -rf ~/ags

ln -s ~/setup/wallpapers ~/Downloads
rm -rf ~/.config/hypr
ln -s ~/setup/hypr ~/.config/
ln -s ~/setup/waybar ~/.config
ln -s ~/setup/wlogout ~/.config
ln -s ~/setup/wofi ~/.config
ln -s ~/setup/foot ~/.config
ln -s ~/setup/ags ~/.config
ln -s ~/setup/eww ~/.config
ln -s ~/setup/mako ~/.config
ln -s ~/setup/wallpaper.sh ~

sudo chmod u+x ~/setup/eww/script/workspaces.sh
sudo chmod u+x ~/setup/eww/script/notification.sh

sudo rm /usr/share/icons/default/index.theme
sudo touch /usr/share/icons/default/index.theme
printf "[Icon Theme]\nInherits=Bibata-Modern-Classic" | sudo tee -a /usr/share/icons/default/index.theme

mkdir -p ~/.config/fish
rm ~/.config/fish/config.fish
touch ~/.config/fish/config.fish
echo "set fish_greeting
alias nvim=\"nvim +\'hi Normal ctermbg=none guibg=none\' +\'set expandtab ts=4 sw=4 ai\'\"
cat ~/.cache/wal/sequences &" >> ~/.config/fish/config.fish

echo "export HYPRSHOT_DIR=~/Pictures/Screenshots/
export GTK_THEME=oomox-colors-oomox
export GTK_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export XMODIFIERS=@im=ibus" >> ~/.bash_profile

mkdir -p ~/.config/xdg-desktop-portal/
rm ~/.config/xdg-desktop-portal/hyprland-portals.conf
touch ~/.config/xdg-desktop-portal/hyprland-portals.conf
echo "[preferred]
default=hyprland;gtk
org.freedesktop.impl.portal.FileChooser=gtk" >> ~/.config/xdg-desktop-portal/hyprland-portals.conf

sudo rm -rf ~/.config/gtk-3.0/settings.ini
mkdir -p ~/.config/gtk-3.0/
touch ~/.config/gtk-3.0/settings.ini
echo "[Settings]
gtk-theme-name=oomox-colors-oomox
gtk-icon-theme-name=Yaru-red-dark
gtk-font-name=Segoe UI 11
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
gtk-application-prefer-dark-theme=1" >> ~/.config/gtk-3.0/settings.ini

sudo rm -rf ~/.gtkrc-2.0
touch ~/.gtkrc-2.0
echo "include \"/home/$USER/.gtkrc-2.0.mine\"
gtk-theme-name=\"oomox-colors-oomox\"
gtk-icon-theme-name=\"Yaru-red-dark\"
gtk-font-name=\"Segoe UI 11\"
gtk-cursor-theme-name=\"Bibata-Modern-Classic\"
gtk-cursor-theme-size=24
gtk-toolbar-style=GTK_TOOLBAR_ICONS
gtk-toolbar-icon-size=GTK_ICON_SIZE_LARGE_TOOLBAR
gtk-button-images=0
gtk-menu-images=0
gtk-enable-event-sounds=1
gtk-enable-input-feedback-sounds=0
gtk-xft-antialias=1
gtk-xft-hinting=1
gtk-xft-hintstyle=\"hintslight\"
gtk-xft-rgba=\"rgb\"" >> ~/.gtkrc-2.0

sudo rm -rf ~/.config/xsettingsd/xsettingsd.conf
mkdir -p ~/.config/xsettingsd/
touch ~/.config/xsettingsd/xsettingsd.conf
echo "Net/ThemeName \"oomox-colors-oomox\"
Net/IconThemeName \"Yaru-red-dark\"
Gtk/CursorThemeName \"Bibata-Modern-Classic\"
Net/EnableEventSounds 1
EnableInputFeedbackSounds 0
Xft/Antialias 1
Xft/Hinting 1
Xft/HintStyle \"hintslight\"
Xft/RGBA \"rgb\"" >> ~/.config/xsettingsd/xsettingsd.conf

curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher
fisher install IlanCosman/tide@v6
tide configure --auto --style=Rainbow --prompt_colors='16 colors' --show_time='24-hour format' --rainbow_prompt_separators=Angled --powerline_prompt_heads=Sharp --powerline_prompt_tails=Flat --powerline_prompt_style='Two lines, character and frame' --prompt_connection=Disconnected --powerline_right_prompt_frame=Yes --prompt_spacing=Sparse --icons='Few icons' --transient=No

sudo mkdir -p /media/nptanphuc
sudo mount /dev/sda2 /media/nptanphuc
sudo mkdir -p /usr/local/share/fonts/WindowsFonts
sudo cp /media/nptanphuc/Windows/Fonts/* /usr/local/share/fonts/WindowsFonts
fc-cache --force

ln -s /media/nptanphuc/Users/HP/Desktop/ ~/Desktop
git clone https://github.com/NvChad/starter ~/.config/nvim

git config --global user.name "SlippyEggingto"
git config --global user.email "phamtanphucnguyen@gmail.com"

firefox
cd ~/.mozilla/firefox/*default-release*/
mkdir -p chrome/
ln -s ~/setup/userChrome.css chrome/
cd ~

printf "\nUUID=F0C2F863C2F83008   /media/nptanphuc   ntfs-3g   uid=1000,gid=1000,umask=0022,sync,auto,nosuid,rw,nouser 0 0" | sudo tee -a /etc/fstab

sudo touch /usr/sbin/update-grub
printf '#!/bin/sh\nset -e\nexec grub-mkconfig -o /boot/grub/grub.cfg "$@"' | sudo tee -a /usr/sbin/update-grub
sudo chown root:root /usr/sbin/update-grub
sudo chmod 755 /usr/sbin/update-grub

sudo sed -i '4s/5/0/' /etc/default/grub
sudo sed -i '6s/ quiet//' /etc/default/grub
sudo sed -i '6s/3/7/' /etc/default/grub
sudo update-grub

sudo touch /etc/keyd/default.conf
printf "[ids]\n\n*\n\n[main]\n\nrightalt = leftcontrol" | sudo tee -a /etc/keyd/default.conf
sudo systemctl enable keyd.service
sudo systemctl start keyd.service

# sudo dd if=/dev/zero of=/SWAP.img bs=1M count=8192
# sudo sync
# sudo chmod 600 /SWAP.img
# sudo mkswap /SWAP.img
# sudo swapon /SWAP.img
# printf "/SWAP.img none swap sw 0 0" | sudo tee -a /etc/fstab

bash wallpaper.sh
ln -s ~/setup/color.cpp ~/.cache/wal/
bash wallpaper.sh

echo "===== Setup was completed. Reboot is required. ====="
