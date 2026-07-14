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

awww img --transition-type grow --transition-pos 0.854,0.997 --transition-step 90 $wallpaper

python3 ~/Personalization/color.py
if [[ "$light_bar" == "true" ]];
then
    python3 ~/Personalization/light_bar.py
fi
echo "done" > ~/Personalization/done_notif

mv ~/Personalization/type5 ~/.config/hypr/

echo "[main]
initial-color-theme=$dark

[colors-light]
foreground=$(sed '2q;d' ~/Personalization/type1)     # onBackground
background=$(sed '1q;d' ~/Personalization/type1)     # background

regular0=$(sed '16q;d' ~/Personalization/type1)      # inverseSurface
regular1=$(sed '53q;d' ~/Personalization/type1)      # onErrorContainer
regular2=$(sed '24q;d' ~/Personalization/type1)      # primaryContainer
regular3=ffd700                                      # temp
regular4=$(sed '34q;d' ~/Personalization/type12)     # secondaryContainer
regular5=$(sed '26q;d' ~/Personalization/type1)      # inversePrimary
regular6=$(sed '43q;d' ~/Personalization/type12)     # tertiaryContainer
regular7=$(sed '13q;d' ~/Personalization/type1)      # onSurfaceVariant

bright0=$(sed '16q;d' ~/Personalization/type1)
bright1=$(sed '53q;d' ~/Personalization/type1)
bright2=$(sed '24q;d' ~/Personalization/type1)
bright3=ffd700
bright4=$(sed '34q;d' ~/Personalization/type1)
bright5=$(sed '26q;d' ~/Personalization/type1)
bright6=$(sed '43q;d' ~/Personalization/type1)
bright7=$(sed '13q;d' ~/Personalization/type1)

# search-box-no-match=$(sed '40q;d' ~/Personalization/type1) $(sed '39q;d' ~/Personalization/type1)
# search-box-match=$(sed '34q;d' ~/Personalization/type1) $(sed '33q;d' ~/Personalization/type1)

# jump-labels=ffffff ffffff
# urls=ffffff

[colors-dark]

foreground=$(sed '2q;d' ~/Personalization/type1)    # onBackground
background=$(sed '1q;d' ~/Personalization/type1)    # background

regular0=$(sed '16q;d' ~/Personalization/type1)     # inverseSurface
regular1=$(sed '52q;d' ~/Personalization/type1)     # errorContainer
regular2=$(sed '24q;d' ~/Personalization/type1)     # primaryContainer
regular3=ffd700                                     # temp
regular4=$(sed '34q;d' ~/Personalization/type1)     # secondaryContainer
regular5=$(sed '26q;d' ~/Personalization/type1)     # inversePrimary
regular6=$(sed '43q;d' ~/Personalization/type1)     # tertiaryContainer
regular7=$(sed '13q;d' ~/Personalization/type1)     # onSurfaceVariant

bright0=$(sed '16q;d' ~/Personalization/type12)
bright1=$(sed '52q;d' ~/Personalization/type12)
bright2=$(sed '24q;d' ~/Personalization/type12)
bright3=ffd700
bright4=$(sed '34q;d' ~/Personalization/type12)
bright5=$(sed '26q;d' ~/Personalization/type12)
bright6=$(sed '43q;d' ~/Personalization/type12)
bright7=$(sed '13q;d' ~/Personalization/type12)

# search-box-no-match=$(sed '40q;d' ~/Personalization/type1) $(sed '39q;d' ~/Personalization/type1)
# search-box-match=$(sed '34q;d' ~/Personalization/type1) $(sed '33q;d' ~/Personalization/type1)

# jump-labels=ffffff ffffff
# urls=ffffff" > ~/.config/foot/theme

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
