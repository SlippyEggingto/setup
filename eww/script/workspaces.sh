#!/bin/bash

hyprland_get_active_workspace() {
    current="$(hyprctl activeworkspace -j | jq .id)"

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

    for ((i = 0; i < $(hyprctl workspaces -j | jq length); i++));
    do
        active="$(hyprctl -j workspaces | jq .[$i].id)"

        if [[ "$active" == "1" ]]; then
            one_class="active"
        elif [[ "$active" == "2" ]]; then
            two_class="active"
        elif [[ "$active" == "3" ]]; then
            three_class="active"
        elif [[ "$active" == "4" ]]; then
            four_class="active"
        elif [[ "$active" == "5" ]]; then
            five_class="active"
        elif [[ "$active" == "6" ]]; then
            six_class="active"
        elif [[ "$active" == "7" ]]; then
            seven_class="active"
        elif [[ "$active" == "8" ]]; then
            eight_class="active"
        elif [[ "$active" == "9" ]]; then
            nine_class="active"
        elif [[ "$active" == "10" ]]; then
            ten_class="active"
        fi
    done
    if [[ "$current" == "1" ]]; then
        one_class="focused"
    elif [[ "$current" == "2" ]]; then
        two_class="focused"
    elif [[ "$current" == "3" ]]; then
        three_class="focused"
    elif [[ "$current" == "4" ]]; then
        four_class="focused"
    elif [[ "$current" == "5" ]]; then
        five_class="focused"
    elif [[ "$current" == "6" ]]; then
        six_class="focused"
    elif [[ "$current" == "7" ]]; then
        seven_class="focused"
    elif [[ "$current" == "8" ]]; then
        eight_class="focused"
    elif [[ "$current" == "9" ]]; then
        nine_class="focused"
    elif [[ "$current" == "10" ]]; then
        ten_class="focused"
    fi
    
    echo "(box :class \"workspaces\" :orientation \"horizontal\" :spacing 8 :space-evenly \"false\" (button :onclick \"hyprctl dispatch workspace 1\" :class \"$one_class\") (button :onclick \"hyprctl dispatch workspace 2\" :class \"$two_class\") (button :onclick \"hyprctl dispatch workspace 3\" :class \"$three_class\") (button :onclick \"hyprctl dispatch workspace 4\" :class \"$four_class\") (button :onclick \"hyprctl dispatch workspace 5\" :class \"$five_class\") (button :onclick \"hyprctl dispatch workspace 6\" :class \"$six_class\") (button :onclick \"hyprctl dispatch workspace 7\" :class \"$seven_class\") (button :onclick \"hyprctl dispatch workspace 8\" :class \"$eight_class\") (button :onclick \"hyprctl dispatch workspace 9\" :class \"$nine_class\") (button :onclick \"hyprctl dispatch workspace 10\" :class \"$ten_class\"))"
}

while true
do
    hyprland_get_active_workspace
done