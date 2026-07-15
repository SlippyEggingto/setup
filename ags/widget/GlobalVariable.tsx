import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalMpris from "gi://AstalMpris?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import AstalBattery from "gi://AstalBattery?version=0.1";
import { createState } from "gnim";

export class PlayerDataType {
    playerName : string;
    playerId: number;
    title : string;
    album : string;
    artist : string;
    position: number
    length : number
    percentages : number
    playback_status : string
    playback_status_icon : string
    cover_art_url : string

    constructor(init?: Partial<PlayerDataType>) {
        this.playerName = ""
        this.playerId = -1
        this.title = "Unknown title"
        this.album = "Unknow album"
        this.artist = "Unknown artist"
        this.position = 0
        this.length = 0
        this.percentages = 0
        this.playback_status = "Playing"
        this.playback_status_icon = "media-playback-start-symbolic"
        this.cover_art_url = ""
    }
}

export const [active_player_data, set_active_player_data] = createState<PlayerDataType>({
    playerName: "",
    playerId: -1,
    title: "Unknown title",
    album: "Unknow album",
    artist: "Unknown artist",
    position: 0,
    length: 0,
    percentages: 0,
    playback_status: "Playing",
    playback_status_icon: "media-playback-start-symbolic",
    cover_art_url: "",
})

export const    hyprland = AstalHyprland.get_default(),
                mpris = AstalMpris.get_default(),
                audio = AstalWp.get_default(),
                battery = AstalBattery.get_default(),
                [clock_first_half, set_clokc_first_half] = createState(""),
                [clock_second_half, set_clokc_second_half] = createState(""),
                [number_of_player_binder, set_number_of_player_binder] = createState(0),
                [current_player_id, set_current_player_id] = createState(1),
                [is_media_window_appearing, set_is_media_window_appearing] = createState(false),
                [all_players_state, set_all_players_state] = createState<PlayerDataType[]>([])