#!/bin/bash

length="$(makoctl history | jq .data.[0] | jq length-1 | bc)"

notification() {
    for i in $(eval echo {0..$length})
    do
        summary="$(makoctl history | jq .data.[0].[$i].summary.data)"
        body="$(makoctl history | jq .data.[0].[$i].body.data)"

        echo "\
    (box :class "notification"\
         :orientation "vertical"\
         :spacing 10\
\
         (button :class "notification-cell"\
                 :onclick "notify-send 'notification-cell'"\
\
                 (box :class "notification-cell-content"\
                      :space-evenly false\
                      :spacing 20\
                      \
                      (image :class "notification-cell-image"\
                              :path "./icons/icon_3.jpg"\
                              :image-width 30\
                              :image-height 30\
                      )\
      \
                      (box :class "notification-cell-label"\
                           :orientation "vertical"\
                           :space-evenly false\
                           :valign "center"\
                           :spacing 5\
      \
                           (label :class "notification-cell-label-summary"\
                                  :wrap true\
                                  :halign "start"\
                                  :text "$summary"\
                                  :show-truncated false\
                                  :limit-width 100\
                           )\
                                 \
                           (label :class "notification-cell-label-body"\
                                  :wrap true\
                                  :xalign 0\
                                  :yalgin 1\
                                  :halign "start"\
                                  :text "$body"\
                                  :show-truncated false\
                                  :limit-width 100\
                           )\
                      )\
                 )\
         )\
    )"
    done
}

notification