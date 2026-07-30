import { Accessor, createBinding, createComputed, This, With } from "gnim";
import Pango from "gi://Pango?version=1.0";
import AstalMpris from "gi://AstalMpris?version=0.1";

const mpris = AstalMpris.get_default()

import {    all_players_array, set_all_players_array,
            current_player, set_current_player,
            PlayerDataType,
            is_media_window_appearing, set_is_media_window_appearing,
            number_of_player_binder, set_number_of_player_binder,
            setMediaWindowPosition,
            current_player_id,
            set_current_player_id,
            get_media_icon_from_playback_status,
            get_media_percentages
       }    from "./GlobalVariable";

function clearOldConnections() {
    for (let connect of all_players_array()) {
        try {
            if (connect.player) {
                for (let id of connect.handlers) {
                    connect.player.disconnect(id);
                }
            }
        } catch(e) {
            console.error(e);
        }

        connect.handlers = []
    }
}

export function __init__() {
    clearOldConnections();

    let temp_all_players_array = new Array<PlayerDataType>;
    let playerCnt = 0;

    for (let i = 0; i < mpris.players.length; i++) {
        let ithplayer = mpris.players[i];

        if (ithplayer === undefined) continue;
        if (ithplayer.canPlay === false || ithplayer.busName === "org.mpris.MediaPlayer2.playerctld") continue;

        let tempPlayer = new PlayerDataType;
        tempPlayer.player = ithplayer;
        tempPlayer.id = playerCnt;

        const handlePlayerUpdate = () => {
            try {
                tempPlayer.player = ithplayer
                
                // set_all_players_array([...all_players_array()])
                set_current_player({ ...current_player() })

                if (tempPlayer.id === current_player_id()) {
                    set_current_player(tempPlayer);
                }
            } catch(e) {
                console.error(e);
            }
        };

        tempPlayer.handlers.push(ithplayer.connect("notify::trackid", handlePlayerUpdate));
        tempPlayer.handlers.push(ithplayer.connect("notify::position", handlePlayerUpdate));
        tempPlayer.handlers.push(ithplayer.connect("notify::playback-status", handlePlayerUpdate));

        temp_all_players_array.push(tempPlayer)
        playerCnt++;
    }

    set_number_of_player_binder(playerCnt);
    set_all_players_array(temp_all_players_array);
    if (current_player_id() >= playerCnt) set_current_player_id(0);

    if (playerCnt > 0) {
        const id = current_player_id();
        const active = temp_all_players_array.find(p => p.id === id) || temp_all_players_array[0];
        set_current_player({ ...active });
    } else set_current_player(new PlayerDataType);
}

setTimeout(() => {
    __init__();

    mpris.connect("notify::players", () => {
        __init__();
    })
}, 1000);

export function Media() {
    return (
        <eventbox class={"media-event-box"} onClick={() => {
            set_is_media_window_appearing(!is_media_window_appearing())
            setMediaWindowPosition();
        }} onScroll={(_, event) => {
            const dy = event.delta_y;

            const number_of_player = number_of_player_binder();
            if (number_of_player <= 1) return;
            
            let current_id = current_player_id();
            if (dy > 0) current_id = (current_id + 1) % number_of_player
            else if (dy < 0) current_id = (current_id - 1 + number_of_player) % number_of_player;

            set_current_player_id(current_id)
            set_current_player(all_players_array()[current_id])
            set_all_players_array([...all_players_array()])
        }}
        >
            <box class={"media"}>
                <With value={current_player}>
                    {(value) => (
                        <box>
                            <box class={"media-progress-outer"}>
                                <circularprogress
                                    class={"media-progress"}
                                    startAt={0.75}
                                    endAt={0.75}
                                    value={get_media_percentages(value.player.position, value.player.length)}
                                >
                                    <icon
                                        class={"media-icon"}
                                        icon={get_media_icon_from_playback_status(value.player.playbackStatus)}
                                    />
                                </circularprogress>
                            </box>
                            <box>
                                <label class={"media-title"}
                                    maxWidthChars={20}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={value.player.title ? value.player.title : "Unknown title"}
                                />
                                <label class={"media-artist"}
                                    maxWidthChars={15}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={" • " + (value.player.artist ? value.player.artist : "Unkown artist")}
                                />
                            </box>
                        </box>
                    )}
                </With>
            </box>
        </eventbox>
    )
}