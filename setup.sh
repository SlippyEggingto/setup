cd ~
mkdir ~/Downloads

echo "Updating and upgrading..."
sudo pacman -Syu

echo "Installing hyprland hyprpaper waybar neovim nwg-look foot fish sway ttf-jetbrains-mono-nerd ntfs-3g wofi..."
sudo pacman -S hyprland hyprpaper waybar neovim nwg-look foot fish sway ttf-jetbrains-mono-nerd ntfs-3g wofi

echo "Configuring hyprpaper, waybar, wlogout, swaylock-effects and wofi..."
mv ~/setup/peakpx.jpg ~/Downloads
mv ~/setup/wallpaper_2.jpg ~/Downloads
rm -rf ~/.config/hypr
mv ~/setup/hypr ~/.config/
mv ~/setup/waybar ~/.config
mv ~/setup/swaylock ~/.config
mv ~/setup/wofi ~/.config

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
git clone https://github.com/NvChad/starter ~/.config/nvim && nvim

echo "Installing yay..."
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

echo "Installing ibus-bamboo google-chrome visual-studio-code-bin wlogout swaylock-effects..."
yay -S ibus-bamboo google-chrome visual-studio-code-bin wlogout swaylock-effects

echo "Creating swap file..."
sudo dd if=/dev/zero of=/SWAP.img bs=1M count=4096
sudo sync
sudo chmod 600 /SWAP.img
sudo mkswap /SWAP.img
sudo swapon /SWAP.img
sudo echo "/SWAP.img none swap sw 0 0" >> /etc/fstab
