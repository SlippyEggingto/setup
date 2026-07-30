import app from "ags/gtk3/app";

import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalMpris from "gi://AstalMpris?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import AstalBattery from "gi://AstalBattery?version=0.1";
import { createState } from "gnim";

export class PlayerDataType {
    player : AstalMpris.Player
    id : number
    handlers : number[]

    constructor() {
        this.player = new AstalMpris.Player
        this.id = 0
        this.handlers = []
    }
}

export const [current_player, set_current_player] = createState<PlayerDataType>({
    player: new AstalMpris.Player,
    id: 0,
    handlers: [],
})

export function setMediaWindowPosition() {
    if (is_media_window_appearing.get()) {
        app.apply_css(`
            .another-media-outer-window {
                margin-top: 0px;
            }

            .media-event-box .media {
                background-color: @onPrimaryContainer;
                color: @primaryContainer;
            }

            .media-event-box .media-progress {
                background-color: alpha(@primaryContainer, .2);
            }
        `)
    } else {
        app.apply_css(`
            .another-media-outer-window {
                margin-top: -175px;
            }

            .media-event-box .media {
                background-color: @primaryContainer;
                color: @onPrimaryContainer;
            }

            .media-event-box .media-progress {
                background-color: alpha(@onPrimaryContainer, .16);
            }
        `)
    }
}

export function get_media_icon_from_playback_status(current_playback_status : AstalMpris.PlaybackStatus) : string {
    if (current_player().player.position === -1) return "media-playback-start-symbolic";
    if (current_playback_status.toString() === "0") return "media-playback-pause-symbolic";
    return "media-playback-start-symbolic";
}

export function get_media_percentages(current_position : number, current_length : number) : number {
    if (current_length === 0) return 1;
    return current_position / current_length;
}

export const    hyprland = AstalHyprland.get_default(),
                mpris = AstalMpris.get_default(),
                audio = AstalWp.get_default(),
                battery = AstalBattery.get_default(),
                [clock_first_half, set_clock_first_half] = createState(""),
                [clock_second_half, set_clock_second_half] = createState(""),
                [number_of_player_binder, set_number_of_player_binder] = createState(0),
                [current_player_id, set_current_player_id] = createState(0),
                [is_media_window_appearing, set_is_media_window_appearing] = createState(false),
                [all_players_array, set_all_players_array] = createState<PlayerDataType[]>([])
                // [current_player, set_current_player] = createState(AstalMpris.Player),
                // [all_players_array, set_all_players_array] = createState<AstalMpris.Player[]>([])