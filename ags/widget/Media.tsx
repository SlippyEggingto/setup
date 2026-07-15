import app from "ags/gtk3/app";
import { createState, With } from "gnim";
import Pango from "gi://Pango?version=1.0";
import AstalMpris from "gi://AstalMpris?version=0.1";

import { setMediaWindowPosition } from "./Bar";
import { active_player_data, number_of_player_binder, set_all_players_state, set_number_of_player_binder } from "./GlobalVariable"
import { PlayerDataType } from "./GlobalVariable";
import { current_player_id, set_current_player_id } from "./GlobalVariable";
import { is_media_window_appearing, set_is_media_window_appearing } from "./GlobalVariable";
import { set_active_player_data } from "./GlobalVariable";

const mpris = AstalMpris.get_default()

export let all_players_array: PlayerDataType[] = [];

export function syncActivePlayer() {
    const target = all_players_array.find(p => p.playerId === current_player_id.get());
    if (target) set_active_player_data({...target})
}

current_player_id.bind(() => {
    syncActivePlayer();
})

export function init() {
    mpris.connect("notify::players", () => {
        all_players_array = []
        let validPlayerCnt = 0;

        for (let i = 0; i < mpris.get_players().length; i++) {
            let current_player = mpris.get_players()[i];
            if (!current_player) continue;
            if (current_player.canPlay === false || current_player.busName === "org.mpris.MediaPlayer2.playerctld") continue;

            validPlayerCnt++;

            let tempPlayerDataType : PlayerDataType = {
                playerName: current_player.busName,
                playerId: validPlayerCnt,
                title: current_player.title || "Unknown title",
                album: current_player.album ||  "Unknow album",
                artist: current_player.artist || "Unknown artist",
                position: current_player.position,
                length: current_player.length,
                percentages: current_player.length !== 0 ? current_player.position / current_player.length : 0,
                playback_status: current_player.playback_status === 0 ? "Playing" : "Pause",
                playback_status_icon: current_player.playbackStatus === 0 ? "media-playback-pause-symbolic" : "media-playback-start-symbolic",
                cover_art_url: current_player.art_url || ""
            }

            all_players_array.push(tempPlayerDataType)
            const handlePlayerUpdate = () => {
                tempPlayerDataType.playerName = current_player.busName
                tempPlayerDataType.title = current_player.title || "Unknown title";
                tempPlayerDataType.album = current_player.album || "Unknown album";
                tempPlayerDataType.artist = current_player.artist || "Unknown artist";
                tempPlayerDataType.position = current_player.position;
                tempPlayerDataType.length = current_player.length;
                tempPlayerDataType.percentages = current_player.length !== 0 ? current_player.position / current_player.length : 0;
                tempPlayerDataType.playback_status = current_player.playback_status === 0 ? "Playing" : "Pause",
                tempPlayerDataType.playback_status_icon = current_player.playbackStatus === 0 ? "media-playback-pause-symbolic" : "media-playback-start-symbolic";
                tempPlayerDataType.cover_art_url = current_player.art_url || "";

                if (tempPlayerDataType.playerId === current_player_id.get()) {
                    syncActivePlayer();
                }

                set_all_players_state([...all_players_array])

            };

            current_player.connect("notify::position", handlePlayerUpdate);
            current_player.connect("notify::playback-status", handlePlayerUpdate);
        }

        set_all_players_state([...all_players_array])
        set_number_of_player_binder(validPlayerCnt)
        if (current_player_id.get() >= validPlayerCnt) set_current_player_id(current_player_id.get() % validPlayerCnt);
        syncActivePlayer();

        console.error(current_player_id.get());

        for (let i = 0; i < validPlayerCnt; i++) {
            console.warn(all_players_array[i].playerName);
        }
    })
}

setTimeout(() => {
    init();
}, 1000);

export function Media() {
    return (
        <eventbox class={"media-event-box"} onClick={() => {
            set_is_media_window_appearing(!is_media_window_appearing.get())
            setMediaWindowPosition();
        }}
        >
            <box class={"media"}>
                <With value={active_player_data}>
                    {(value) => value &&
                        <box>
                            <box class={"media-progress-outer"}>
                                <circularprogress
                                    class={"media-progress"}
                                    startAt={0.75}
                                    endAt={0.75}
                                    value={value.percentages}
                                >
                                    <icon
                                        class={"media-icon"}
                                        icon={value.playback_status_icon}
                                    />
                                </circularprogress>
                            </box>
                            <box>
                                <label class={"media-title"}
                                    maxWidthChars={20}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={value.title}
                                />
                                <label class={"media-artist"}
                                    maxWidthChars={15}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={" • " + value.artist}
                                />
                            </box>
                        </box>
                    }
                </With>
            </box>
        </eventbox>
    )
}