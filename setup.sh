#!/bin/bash

cd ~
mkdir -p ~/Desktop
mkdir -p ~/Downloads
mkdir -p ~/Documents
mkdir -p ~/Pictures/Screenshots
mkdir -p ~/.config/mako
mkdir -p ~/Personalization

sudo rm /etc/pacman.conf -rf
sudo ln -s ~/setup/pacman.conf /etc

sudo rm /etc/pacman.d/mirrorlist -rf
sudo ln -s ~/setup/mirrorlist /etc/pacman.d/

sudo pacman-key --init
sudo pacman-key --populate archlinux
sudo pacman-key --recv-key 3056513887B78AEB --keyserver keyserver.ubuntu.com
sudo pacman-key --lsign-key 3056513887B78AEB
sudo pacman-key --init
sudo pacman-key --populate archlinux

sudo pacman -Syyuu
sudo pacman -S hyprland hyprpaper neovim foot fish ttf-nerd-fonts-symbols-mono wofi cliphist brightnessctl hyprlock hyprpicker hyprshot mako nautilus google-chrome vulkan-intel vulkan-tools neofetch htop tree ntfs-3g yay xdg-desktop-portal-gtk xdg-desktop-portal-hyprland bibata-cursor-theme fcitx5 fcitx5-unikey fcitx5-config-qt cmus polkit-kde-agent qt5-wayland qt6-wayland visual-studio-code-bin keyd socat swww typescript npm meson gjs gnome-bluetooth-3.0 upower gobject-introspection libdbusmenu-gtk3 libsoup3 glib2 glib2-devel yaru-icon-theme python-materialyoucolor-git yad ttf-ms-fonts ttf-sourcecodepro-nerd sublime-text pamixer aylurs-gtk-shell unrar unzip p7zip gnome-tweaks gnome-font-viewer gnome-text-editor usbutils less gvfs-mtp gtk-layer-shell gtk4-layer-shell aylurs-gtk-shell libastal-4 libastal-battery libastal libastal-hyprland libastal-io libastal-mpris libastal-network libastal-tray libastal-wireplumber astal-notifd gtkmm-4.0 gdk-pixbuf2 playerctl xdg-desktop-portal-gnome
# sudo pacman -Rsn gnome-app-list gnome-backgrounds gnome-color-manager gnome-connections gnome-console gnome-contacts gnome-control-center gnome-desktop gnome-logs gnome-keybindings gnome-maps gnome-menus gnome-online-accounts gnome-remote-desktop gnome-session gnome-settings-daemon gnome-shell gnome-software gnome-system-monitor gnome-tour gnome-user-docs gnome-user-share gnome-weather evince gdm sushi
sudo npm install -g sass

git clone https://github.com/yeyushengfan258/Win11-icon-theme.git ~/Win11-icon-theme/
cd ~/Win11-icon-theme
bash ./install.sh
cd ~
sudo rm -rf ~/Win11-icon-theme

ln -s ~/setup/wallpapers ~/Downloads
rm -rf ~/.config/hypr
ln -s ~/setup/hypr ~/.config
ln -s ~/setup/wofi ~/.config
ln -s ~/setup/foot ~/.config
ln -s ~/setup/ags ~/.config
ln -s ~/setup/wallpaper.sh ~
ln -s ~/setup/color.py ~/Personalization
ln -s ~/setup/light_bar.py ~/Personalization

mkdir -p ~/.themes
ln -s ~/setup/Personalization ~/.themes

sudo rm /usr/share/icons/default/index.theme
sudo touch /usr/share/icons/default/index.theme
printf "[Icon Theme]\nInherits=Bibata-Modern-Classic" | sudo tee -a /usr/share/icons/default/index.theme

mkdir -p ~/.config/fish
rm ~/.config/fish/config.fish
touch ~/.config/fish/config.fish
echo "set fish_greeting
alias nvim=\"nvim +\\\"hi Normal ctermbg=none guibg=none\\\" +\\\"set expandtab ts=4 sw=4 ai\\\"\"" >> ~/.config/fish/config.fish

echo "export HYPRSHOT_DIR=~/Pictures/Screenshots/
export XDG_PICTURES_DIR=\"~/Pictures/Webcam/Pictures\"
export XDG_VIDEOS_DIR=\"~/Pictures/Webcam/Videos\"
export EDITOR=subl
alias Hyprland=\"start-hyprland\"" >> ~/.bash_profile

mkdir -p ~/.config/xdg-desktop-portal/
rm ~/.config/xdg-desktop-portal/hyprland-portals.conf
touch ~/.config/xdg-desktop-portal/hyprland-portals.conf
echo "[preferred]
default=hyprland;gtk
org.freedesktop.impl.portal.FileChooser=gtk
org.freedesktop.impl.portal.ScreenCast=hyprland
org.freedesktop.impl.portal.Screenshot=hyprland" >> ~/.config/xdg-desktop-portal/hyprland-portals.conf

# curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher
# fisher install IlanCosman/tide@v6
# tide configure --auto --style=Rainbow --prompt_colors='16 colors' --show_time='24-hour format' --rainbow_prompt_separators=Angled --powerline_prompt_heads=Sharp --powerline_prompt_tails=Flat --powerline_prompt_style='Two lines, character and frame' --prompt_connection=Disconnected --powerline_right_prompt_frame=Yes --prompt_spacing=Sparse --icons='Few icons' --transient=No

git clone https://github.com/NvChad/starter ~/.config/nvim

git config --global user.name "SlippyEggingto"
git config --global user.email "phamtanphucnguyen@gmail.com"

sudo touch /usr/sbin/update-grub
printf '#!/bin/sh\nset -e\nexec grub-mkconfig -o /boot/grub/grub.cfg "$@"' | sudo tee -a /usr/sbin/update-grub
sudo chown root:root /usr/sbin/update-grub
sudo chmod 755 /usr/sbin/update-grub

sudo sed -i '4s/5/0/' /etc/default/grub
sudo sed -i '6s/ quiet//' /etc/default/grub
sudo sed -i '6s/3/7 libata.force=noncq brcmfmac.feature_disable=0x82000/' /etc/default/grub
sudo update-grub

sudo touch /etc/keyd/default.conf
printf "[ids]\n\n*\n\n[main]\n\nrightalt = layer(control)\nrightshift = rightshift" | sudo tee -a /etc/keyd/default.conf
sudo systemctl enable keyd.service
sudo systemctl start keyd.service

# sudo dd if=/dev/zero of=/SWAP.img bs=1M count=8192
# sudo sync
# sudo chmod 600 /SWAP.img
# sudo mkswap /SWAP.img
# sudo swapon /SWAP.img
# printf "/SWAP.img none swap sw 0 0" | sudo tee -a /etc/fstab

# bash wallpaper.sh

echo "===== Setup was completed. Reboot is required. ====="
