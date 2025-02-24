# wallpaper=$(yad --file --add-preview --large-preview --workdir=/home/$USER/Downloads/wallpapers/)
wallpaper=~/Downloads/wallpapers/wall_44.webp

if [[ "$wallpaper" == "" ]]; then
    exit 1
fi

dark=true

printf "wallpaper: "
printf $wallpaper | tee /home/$USER/Downloads/wallpapers/wallpaper
printf "\nis dark scheme: "
printf $dark | tee /home/$USER/Downloads/wallpapers/dark
printf "\n"

swww img --transition-type grow --transition-pos 0.854,0.997 --transition-step 90 $wallpaper

python3 ~/.cache/wal/color.py
#python3 ~/.cache/wal/light_bar.py
printf ags | tee /home/$USER/Downloads/wallpapers/ags

echo "background-color=$(sed '28q;d' ~/.cache/wal/materialyoucolor-python)
text-color=$(sed '29q;d' ~/.cache/wal/materialyoucolor-python)
border-size=0
max-history=15
sort=+time
font="Montserrat"1
max-visible=14
height=250
border-radius=16
default-timeout=7000" > ~/.config/mako/config

makoctl reload

if [[ "$dark" == "false" ]];
then
    gsettings set org.gnome.desktop.interface color-scheme 'prefer-light'

echo "@define-color accent_color @primaryFixedDim;
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
@define-color sidebar_backdrop_color @window_bg_color;" > ~/.cache/wal/gtk4.css

echo "NAME=wal
BG=$(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)
FG=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
MENU_BG=$(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)
MENU_FG=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
SEL_BG=$(sed '30q;d' ~/.cache/wal/template-materialyoucolor-python)
SEL_FG=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
TXT_BG=$(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)
TXT_FG=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
BTN_BG=$(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)
BTN_FG=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
HDR_BG=$(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)
HDR_FG=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
GTK3_GENERATE_DARK=True
ROUNDNESS=10
SPACING=3
GRADIENT=0.0" > ~/.cache/wal/colors-oomox

# #ff0000
# #00ff00
# #0000ff
# #ffff00
# #ff00ff
# #00ffff
# #987654
# #246357

echo "[colors]
foreground=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
background=$(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)

regular0=$(sed '26q;d' ~/.cache/wal/template-materialyoucolor-python)
regular1=$(sed '39q;d' ~/.cache/wal/template-materialyoucolor-python)
regular2=$(sed '35q;d' ~/.cache/wal/template-materialyoucolor-python)
regular3=$(sed '39q;d' ~/.cache/wal/template-materialyoucolor-python)
regular4=$(sed '26q;d' ~/.cache/wal/template-materialyoucolor-python)
regular5=$(sed '35q;d' ~/.cache/wal/template-materialyoucolor-python)
regular6=$(sed '29q;d' ~/.cache/wal/template-materialyoucolor-python)
regular7=$(sed '27q;d' ~/.cache/wal/template-materialyoucolor-python)

bright0=$(sed '26q;d' ~/.cache/wal/template-materialyoucolor-python)
bright1=$(sed '54q;d' ~/.cache/wal/template-materialyoucolor-python)
bright2=$(sed '52q;d' ~/.cache/wal/template-materialyoucolor-python)
bright3=$(sed '40q;d' ~/.cache/wal/template-materialyoucolor-python)
bright4=0000ff
bright5=ffff00
bright6=$(sed '29q;d' ~/.cache/wal/template-materialyoucolor-python)
bright7=$(sed '27q;d' ~/.cache/wal/template-materialyoucolor-python)

selection-foreground=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python)
selection-background=$(sed '30q;d' ~/.cache/wal/template-materialyoucolor-python)

search-box-no-match=$(sed '40q;d' ~/.cache/wal/template-materialyoucolor-python) $(sed '39q;d' ~/.cache/wal/template-materialyoucolor-python)
search-box-match=$(sed '34q;d' ~/.cache/wal/template-materialyoucolor-python) $(sed '33q;d' ~/.cache/wal/template-materialyoucolor-python)

jump-labels=ffffff ffffff
urls=ffffff" > ~/.config/foot/theme

elif [[ "$dark" == "true" ]];
then
    gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'

echo "@define-color accent_color @primaryFixedDim;
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
@define-color sidebar_backdrop_color @window_bg_color;" > ~/.cache/wal/gtk4.css

echo "NAME=wal
BG=$(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)
FG=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
MENU_BG=$(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)
MENU_FG=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
SEL_BG=$(sed '30q;d' ~/.cache/wal/template-materialyoucolor-python)
SEL_FG=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
TXT_BG=$(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)
TXT_FG=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
BTN_BG=$(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)
BTN_FG=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
HDR_BG=$(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)
HDR_FG=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
GTK3_GENERATE_DARK=True
ROUNDNESS=10
SPACING=3
GRADIENT=0.0" > ~/.cache/wal/colors-oomox

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

# bri0 = start-end borders, auto-complete
# bri1 = wrong-command, failed-command-arrow
# bri2 = true-command-arrow
# bri3 = returned-number-foreground
# bri4 = <>
# bri5 = <>
# bri6 = ~ character of true-path
# bri7 = dirs-foreground

echo "[colors]
foreground=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
background=$(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)

regular0=$(sed '26q;d' ~/.cache/wal/template-materialyoucolor-python)
regular1=$(sed '39q;d' ~/.cache/wal/template-materialyoucolor-python)
regular2=$(sed '35q;d' ~/.cache/wal/template-materialyoucolor-python)
regular3=$(sed '41q;d' ~/.cache/wal/template-materialyoucolor-python)
regular4=$(sed '26q;d' ~/.cache/wal/template-materialyoucolor-python)
regular5=$(sed '35q;d' ~/.cache/wal/template-materialyoucolor-python)
regular6=$(sed '29q;d' ~/.cache/wal/template-materialyoucolor-python)
regular7=$(sed '27q;d' ~/.cache/wal/template-materialyoucolor-python)

bright0=$(sed '26q;d' ~/.cache/wal/template-materialyoucolor-python)
bright1=$(sed '52q;d' ~/.cache/wal/template-materialyoucolor-python)
bright2=$(sed '52q;d' ~/.cache/wal/template-materialyoucolor-python)
bright3=$(sed '40q;d' ~/.cache/wal/template-materialyoucolor-python)
bright4=ffffff
bright5=ffffff
bright6=$(sed '29q;d' ~/.cache/wal/template-materialyoucolor-python)
bright7=$(sed '27q;d' ~/.cache/wal/template-materialyoucolor-python)

selection-foreground=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python)
selection-background=$(sed '30q;d' ~/.cache/wal/template-materialyoucolor-python)

search-box-no-match=$(sed '40q;d' ~/.cache/wal/template-materialyoucolor-python) $(sed '39q;d' ~/.cache/wal/template-materialyoucolor-python)
search-box-match=$(sed '47q;d' ~/.cache/wal/template-materialyoucolor-python) $(sed '49q;d' ~/.cache/wal/template-materialyoucolor-python)

jump-labels=ffffff ffffff
urls=ffffff" > ~/.config/foot/theme

fi

oomox-cli ~/.cache/wal/colors-oomox -m gtk320
