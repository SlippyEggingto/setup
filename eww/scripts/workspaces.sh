#!/bin/bash

hyprland_get_active_workspace() {

    one_class="button"
    two_class="button"
    three_class="button"
    four_class="button"
    five_class="button"
    six_class="button"
    seven_class="button"
    eight_class="button"
    nine_class="button"
    ten_class="button"
    
    current="$(hyprctl activeworkspace -j | jq .id)"

    if [[ "$current" == "1" ]]; then
        one_class="button focused"
    elif [[ "$current" == "2" ]]; then
        two_class="button focused"
    elif [[ "$current" == "3" ]]; then
        three_class="button focused"
    elif [[ "$current" == "4" ]]; then
        four_class="button focused"
    elif [[ "$current" == "5" ]]; then
        five_class="button focused"
    elif [[ "$current" == "6" ]]; then
        six_class="button focused"
    elif [[ "$current" == "7" ]]; then
        seven_class="button focused"
    elif [[ "$current" == "8" ]]; then
        eight_class="button focused"
    elif [[ "$current" == "9" ]]; then
        nine_class="button focused"
    elif [[ "$current" == "10" ]]; then
        ten_class="button focused"
    fi

    for ((i = 0; i < $(hyprctl workspaces -j | jq length); i++));
    do
        active="$(hyprctl -j workspaces | jq .[$i].id)"

        if [[ "$active" == "1" && "$current" == "1" ]]; then
            one_class="button active focused"
        elif [[ "$active" == "2" && "$current" == "2" ]]; then
            two_class="button active focused"
        elif [[ "$active" == "3" && "$current" == "3" ]]; then
            three_class="button active focused"
        elif [[ "$active" == "4" && "$current" == "4" ]]; then
            four_class="button active focused"
        elif [[ "$active" == "5" && "$current" == "5" ]]; then
            five_class="button active focused"
        elif [[ "$active" == "6" && "$current" == "6" ]]; then
            six_class="button active focused"
        elif [[ "$active" == "7" && "$current" == "7" ]]; then
            seven_class="button active focused"
        elif [[ "$active" == "8" && "$current" == "8" ]]; then
            eight_class="button active focused"
        elif [[ "$active" == "9" && "$current" == "9" ]]; then
            nine_class="button active focused"
        elif [[ "$active" == "10" && "$current" == "10" ]]; then
            ten_class="button active focused"
        elif [[ "$active" == "1" ]]; then
            one_class="button active"
        elif [[ "$active" == "2" ]]; then
            two_class="button active"
        elif [[ "$active" == "3" ]]; then
            three_class="button active"
        elif [[ "$active" == "4" ]]; then
            four_class="button active"
        elif [[ "$active" == "5" ]]; then
            five_class="button active"
        elif [[ "$active" == "6" ]]; then
            six_class="button active"
        elif [[ "$active" == "7" ]]; then
            seven_class="button active"
        elif [[ "$active" == "8" ]]; then
            eight_class="button active"
        elif [[ "$active" == "9" ]]; then
            nine_class="button active"
        elif [[ "$active" == "10" ]]; then
            ten_class="button active"
        fi
    done
    
    echo "\
(box :class \"workspaces\" \
     :orientation \"horizontal\" \
     :spacing 5 :space-evenly \"false\" \
     (button :onclick \"hyprctl dispatch workspace 1\" :class \"$one_class\") \
     (button :onclick \"hyprctl dispatch workspace 2\" :class \"$two_class\") \
     (button :onclick \"hyprctl dispatch workspace 3\" :class \"$three_class\") \
     (button :onclick \"hyprctl dispatch workspace 4\" :class \"$four_class\") \
     (button :onclick \"hyprctl dispatch workspace 5\" :class \"$five_class\") \
     (button :onclick \"hyprctl dispatch workspace 6\" :class \"$six_class\") \
     (button :onclick \"hyprctl dispatch workspace 7\" :class \"$seven_class\") \
     (button :onclick \"hyprctl dispatch workspace 8\" :class \"$eight_class\") \
     (button :onclick \"hyprctl dispatch workspace 9\" :class \"$nine_class\") \
     (button :onclick \"hyprctl dispatch workspace 10\" :class \"$ten_class\") \
)"

    # echo "(box :class \"workspaces\" :orientation \"horizontal\" :spacing 5 :space-evenly \"false\" (button :onclick \"hyprctl dispatch workspace 1\" :class \"$one_class\") (button :onclick \"hyprctl dispatch workspace 2\" :class \"$two_class\") (button :onclick \"hyprctl dispatch workspace 3\" :class \"$three_class\") (button :onclick \"hyprctl dispatch workspace 4\" :class \"$four_class\") (button :onclick \"hyprctl dispatch workspace 5\" :class \"$five_class\") (button :onclick \"hyprctl dispatch workspace 6\" :class \"$six_class\") (button :onclick \"hyprctl dispatch workspace 7\" :class \"$seven_class\") (button :onclick \"hyprctl dispatch workspace 8\" :class \"$eight_class\") (button :onclick \"hyprctl dispatch workspace 9\" :class \"$nine_class\") (button :onclick \"hyprctl dispatch workspace 10\" :class \"$ten_class\"))"
}

socat -u UNIX-CONNECT:$XDG_RUNTIME_DIR/hypr/$HYPRLAND_INSTANCE_SIGNATURE/.socket2.sock - | while read -r line; do
	hyprland_get_active_workspace
done