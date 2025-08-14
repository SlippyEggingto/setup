wallpaper=$(yad --title="Open file" --file --add-preview --large-preview --workdir=/home/$USER/Downloads/wallpapers/)

if [[ "$wallpaper" == "" ]]; then
    exit 1
fi

dark=dark
light_bar=true

printf "wallpaper: "
printf $wallpaper | tee /home/$USER/Personalization/wallpaper
printf "\nis dark scheme: "
printf $dark | tee /home/$USER/Personalization/color_scheme
printf "\nis light bar: "
printf $light_bar | tee /home/$USER/Personalization/light_bar
printf "\n"

swww img --transition-type grow --transition-pos 0.854,0.997 --transition-step 90 $wallpaper


python3 ~/Personalization/color.py
if [[ "$light_bar" == "true" ]];
then
    python3 ~/Personalization/light_bar.py
fi
mv ~/Personalization/type5 ~/.config/hypr/

if [[ "$dark" == "light" ]];
then
    gsettings set org.gnome.desktop.interface color-scheme 'prefer-light'

echo "@import url('/home/nptanphuc/Personalization/type4.css');
@define-color accent_color @primaryFixedDim;
@define-color accent_fg_color @onPrimaryFixed;
@define-color accent_bg_color @primaryFixedDim;
@define-color window_bg_color @secondaryContainer;
@define-color window_fg_color @onSecondaryContainer;
@define-color headerbar_bg_color @secondaryContainer;
@define-color headerbar_fg_color @onSecondaryContainer;
@define-color popover_bg_color @secondaryContainer;
@define-color popover_fg_color @onSecondaryContainer;
@define-color view_bg_color color-mix(in srgb, @secondaryContainer 95%, @onSecondaryContainer);
@define-color view_fg_color @onSecondaryContainer;
@define-color card_bg_color color-mix(in srgb, @secondaryContainer 95%, @onSecondaryContainer);
@define-color card_fg_color @onSecondaryContainer;
@define-color sidebar_bg_color @window_bg_color;
@define-color sidebar_fg_color @window_fg_color;
@define-color sidebar_border_color @window_bg_color;
@define-color sidebar_backdrop_color @window_bg_color;" > ~/Personalization/gtk4.css

# echo "NAME=wal
# BG=$(sed '33q;d' ~/Personalization/type1)
# FG=$(sed '34q;d' ~/Personalization/type1)
# MENU_BG=$(sed '33q;d' ~/Personalization/type1)
# MENU_FG=$(sed '34q;d' ~/Personalization/type1)
# SEL_BG=$(sed '30q;d' ~/Personalization/type1)
# SEL_FG=$(sed '34q;d' ~/Personalization/type1)
# TXT_BG=$(sed '33q;d' ~/Personalization/type1)
# TXT_FG=$(sed '34q;d' ~/Personalization/type1)
# BTN_BG=$(sed '33q;d' ~/Personalization/type1)
# BTN_FG=$(sed '34q;d' ~/Personalization/type1)
# HDR_BG=$(sed '33q;d' ~/Personalization/type1)
# HDR_FG=$(sed '34q;d' ~/Personalization/type1)
# GTK3_GENERATE_DARK=False
# ROUNDNESS=10
# SPACING=3
# GRADIENT=0.0" > ~/.cache/wal/colors-oomox

# #ff0000
# #00ff00
# #0000ff
# #ffff00
# #ff00ff
# #00ffff
# #987654
# #246357

echo "[colors]
foreground=$(sed '34q;d' ~/Personalization/type1)
background=$(sed '33q;d' ~/Personalization/type1)

regular0=$(sed '27q;d' ~/Personalization/type1)
regular1=$(sed '39q;d' ~/Personalization/type1)
regular2=$(sed '35q;d' ~/Personalization/type1)
regular3=$(sed '26q;d' ~/Personalization/type1)
regular4=$(sed '30q;d' ~/Personalization/type1)
regular5=$(sed '35q;d' ~/Personalization/type1)
regular6=$(sed '29q;d' ~/Personalization/type1)
regular7=$(sed '26q;d' ~/Personalization/type1)

bright0=$(sed '26q;d' ~/Personalization/type1)
bright1=$(sed '52q;d' ~/Personalization/type1)
bright2=$(sed '52q;d' ~/Personalization/type1)
bright3=$(sed '40q;d' ~/Personalization/type1)
bright4=ffffff
bright5=ffffff
bright6=$(sed '47q;d' ~/Personalization/type1)
bright7=$(sed '26q;d' ~/Personalization/type1)

selection-foreground=$(sed '34q;d' ~/Personalization/type1)
selection-background=$(sed '30q;d' ~/Personalization/type1)

search-box-no-match=$(sed '40q;d' ~/Personalization/type1) $(sed '39q;d' ~/Personalization/type1)
search-box-match=$(sed '34q;d' ~/Personalization/type1) $(sed '33q;d' ~/Personalization/type1)

jump-labels=ffffff ffffff
urls=ffffff" > ~/.config/foot/theme

elif [[ "$dark" == "dark" ]];
then
    gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'

echo "@import url('/home/nptanphuc/Personalization/type4.css');
@define-color accent_color @primaryFixedDim;
@define-color accent_fg_color @onPrimaryFixed;
@define-color accent_bg_color @primaryFixedDim;
@define-color window_bg_color @onSecondaryFixed;
@define-color window_fg_color @secondaryFixed;
@define-color headerbar_bg_color @onSecondaryFixed;
@define-color headerbar_fg_color @secondaryFixed;
@define-color popover_bg_color @onSecondaryFixed;
@define-color popover_fg_color @secondaryFixed;
@define-color view_bg_color color-mix(in srgb, @onSecondaryFixed 95%, @secondaryFixed);
@define-color view_fg_color @secondaryFixed;
@define-color card_bg_color color-mix(in srgb, @onSecondaryFixed 95%, @secondaryFixed);
@define-color card_fg_color @secondaryFixed;
@define-color sidebar_bg_color @window_bg_color;
@define-color sidebar_fg_color @window_fg_color;
@define-color sidebar_border_color @window_bg_color;
@define-color sidebar_backdrop_color @window_bg_color;" > ~/Personalization/gtk4.css

# echo "NAME=wal
# BG=$(sed '49q;d' ~/Personalization/type1)
# FG=$(sed '47q;d' ~/Personalization/type1)
# MENU_BG=$(sed '49q;d' ~/Personalization/type1)
# MENU_FG=$(sed '47q;d' ~/Personalization/type1)
# SEL_BG=$(sed '30q;d' ~/Personalization/type1)
# SEL_FG=$(sed '47q;d' ~/Personalization/type1)
# TXT_BG=$(sed '49q;d' ~/Personalization/type1)
# TXT_FG=$(sed '47q;d' ~/Personalization/type1)
# BTN_BG=$(sed '49q;d' ~/Personalization/type1)
# BTN_FG=$(sed '47q;d' ~/Personalization/type1)
# HDR_BG=$(sed '49q;d' ~/Personalization/type1)
# HDR_FG=$(sed '47q;d' ~/Personalization/type1)
# GTK3_GENERATE_DARK=True
# ROUNDNESS=10
# SPACING=3
# GRADIENT=0.0" > ~/.cache/wal/colors-oomox

# reg0 = clock-foreground, time-foreground, cmus-album-foreground, cmus-timer-foreground
# reg1 = returned-number-background (127, 128,...)
# reg2 = console-message
# reg3 = quoted ARGUMENTS, time-background
# reg4 = dirs-background, true-command, cmus-background
# reg5 = console-crital
# reg6 = true-path, sub-command
# reg7 = clock-background, cmus-foreground, cmus-album-background, cmus-timer-background

# keep reg4
# => reg0 contrast reg7
# => reg7 contrast reg4
# => reg0 contrast reg3

# keep reg7
# => bri6 = fg

# bri0 = start-end borders, auto-complete
# bri1 = wrong-command, failed-command-arrow
# bri2 = true-command-arrow
# bri3 = returned-number-foreground
# bri4 = <>
# bri5 = <>
# bri6 = ~ character of true-path
# bri7 = dirs-foreground

echo "[colors]
foreground=$(sed '47q;d' ~/Personalization/type1)
background=$(sed '49q;d' ~/Personalization/type1)

regular0=$(sed '27q;d' ~/Personalization/type1)
regular1=$(sed '39q;d' ~/Personalization/type1)
regular2=$(sed '35q;d' ~/Personalization/type1)
regular3=$(sed '26q;d' ~/Personalization/type1)
regular4=$(sed '30q;d' ~/Personalization/type1)
regular5=$(sed '35q;d' ~/Personalization/type1)
regular6=$(sed '29q;d' ~/Personalization/type1)
regular7=$(sed '26q;d' ~/Personalization/type1)

bright0=$(sed '26q;d' ~/Personalization/type1)
bright1=$(sed '52q;d' ~/Personalization/type1)
bright2=$(sed '52q;d' ~/Personalization/type1)
bright3=$(sed '40q;d' ~/Personalization/type1)
bright4=ffffff
bright5=ffffff
bright6=$(sed '47q;d' ~/Personalization/type1)
bright7=$(sed '26q;d' ~/Personalization/type1)

selection-foreground=$(sed '47q;d' ~/Personalization/type1)
selection-background=$(sed '30q;d' ~/Personalization/type1)

search-box-no-match=$(sed '40q;d' ~/Personalization/type1) $(sed '39q;d' ~/Personalization/type1)
search-box-match=$(sed '47q;d' ~/Personalization/type1) $(sed '49q;d' ~/Personalization/type1)

jump-labels=ffffff ffffff
urls=ffffff" > ~/.config/foot/theme

fi

echo "background-color=$(sed '28q;d' ~/Personalization/type2)
text-color=$(sed '29q;d' ~/Personalization/type2)
border-size=0
max-history=15
sort=+time
font=Segoe UI 12
max-visible=14
height=1000
width=400
border-radius=16
default-timeout=7000" > ~/.config/mako/config

makoctl reload

# oomox-cli ~/.cache/wal/colors-oomox -m gtk320
