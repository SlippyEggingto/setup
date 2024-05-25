cd ~
mkdir ~/Desktop
mkdir ~/Downloads
mkdir ~/Documents
mkdir ~/Pictures
mkdir ~/Pictures/Screenshots

echo "Updating and upgrading..."
sudo pacman -Syu

echo "Installing hyprland hyprpaper waybar neovim nwg-look foot fish ttf-jetbrains-mono-nerd ntfs-3g wofi python-pywal cliphist..."
sudo pacman -S hyprland hyprpaper waybar neovim nwg-look foot fish ttf-jetbrains-mono-nerd ntfs-3g wofi python-pywal cliphist

echo "Configuring hyprpaper, waybar, wlogout, swaylock-effects, wofi, foot, and fish..."
mv ~/setup/wallpapers ~/Downloads
rm -rf ~/.config/hypr
mv ~/setup/hypr ~/.config/
mv ~/setup/waybar ~/.config
mv ~/setup/wlogout ~/.config
mv ~/setup/swaylock ~/.config
mv ~/setup/wofi ~/.config
mv ~/setup/foot ~/.config
mkdir ~/.config/fish
mv ~/setup/fish/config.fish ~/.config/fish
mv ~/setup/wallpaper.sh ~

echo "Installing Windows fonts..."
sudo mkdir /media
sudo mkdir /media/nptanphuc
sudo mount /dev/sda2 /media/nptanphuc
sudo mkdir /usr/local/share/fonts
sudo mkdir /usr/local/share/fonts/WindowsFonts
sudo cp /mnt/Windows/Fonts/* /usr/local/share/fonts/WindowsFonts
fc-cache --force

echo "Mounting F0C2F863C2F83008 on startup..."
sudo cp /etc/fstab /etc/fstab.backup
sudo echo "UUID=F0C2F863C2F83008 	/media/nptanphuc	ntfs-3g		uid=1000,gid=1000,umask=0022,sync,auto,nosuid,rw,nouser 0 0" >> /etc/fstab

echo "Creating Desktop shortcut..."
ln -s /media/nptanphuc/Users/HP/Desktop/ ~/Desktop

echo "Installing nvchad..."
git clone https://github.com/NvChad/starter ~/.config/nvim

echo "Installing yay..."
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

cd ~
echo "Installing ibus-bamboo google-chrome visual-studio-code-bin wlogout swaylock-effects hyprshot..."
yay -S ibus-bamboo google-chrome visual-studio-code-bin wlogout swaylock-effects hyprshot

echo "Creating swap file..."
sudo dd if=/dev/zero of=/SWAP.img bs=1M count=4096
sudo sync
sudo chmod 600 /SWAP.img
sudo mkswap /SWAP.img
sudo swapon /SWAP.img
sudo echo "/SWAP.img none swap sw 0 0" >> /etc/fstab

echo "Creating update-grub command..."
touch /usr/sbin/update-grub
echo "#!/bin/sh
set -e
exec grub-mkconfig -o /boot/grub/grub.cfg "$@"" >> /usr/sbin/update-grub
sudo chown root:root /usr/sbin/update-grub
sudo chmod 755 /usr/sbin/update-grub

echo "===== Setup is completed. Reboot is required. ====="
