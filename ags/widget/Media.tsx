import { With } from "gnim";
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
            set_current_player_id
       }    from "./GlobalVariable";

let active_connections : { player : any, handlers : number[] }[] = [];

function clearOldConnections() {
    for (let connect of active_connections) {
        try {
            if (connect.player) {
                for (let id of connect.handlers) {
                    connect.player.disconnect(id);
                }
            }
        } catch(e) {
            console.error(e);
        }
    }

    active_connections = [];
}

export function __init__() {
    clearOldConnections();

    let temp_all_players_array = new Array<PlayerDataType>;
    let playerCnt = 0;

    for (let i = 0; i < mpris.players.length; i++) {
        let ithplayer = mpris.players[i];

        if (ithplayer === undefined) continue;
        if (ithplayer.canPlay === false || ithplayer.busName === "org.mpris.MediaPlayer2.playerctld") continue;

        // console.log(ithplayer.identity)

        let tempPlayer = new PlayerDataType();
        tempPlayer.playerName = ithplayer.busName;
        tempPlayer.playerId = playerCnt;
        tempPlayer.title = ithplayer.title || "Unknown title";
        tempPlayer.album = ithplayer.album || "Unknown album";
        tempPlayer.artist = ithplayer.artist || "Unknown artist";
        tempPlayer.position = ithplayer.position;
        tempPlayer.length = ithplayer.length;
        tempPlayer.percentages = ithplayer.length !== 0 ? ithplayer.position / ithplayer.length : 0;
        const ps = (ithplayer.playback_status !== undefined) ? ithplayer.playback_status : ithplayer.playbackStatus;
        tempPlayer.playback_status = ps === 0 ? "Playing" : "Pause";
        tempPlayer.playback_status_icon = ps === 0 ? "media-playback-pause-symbolic" : "media-playback-start-symbolic";
        tempPlayer.cover_art_url = ithplayer.cover_art || "";

        temp_all_players_array.push(tempPlayer)
        playerCnt++;

        const handlePlayerUpdate = () => {
            try {
                tempPlayer.playerName = ithplayer.busName
                tempPlayer.title = ithplayer.title || "Unknown title";
                tempPlayer.album = ithplayer.album || "Unknown album";
                tempPlayer.artist = ithplayer.artist || "Unknown artist";
                tempPlayer.position = ithplayer.position;
                tempPlayer.length = ithplayer.length;
                tempPlayer.percentages = ithplayer.length !== 0 ? ithplayer.position / ithplayer.length : 0;
                tempPlayer.playback_status = ithplayer.playback_status === 0 ? "Playing" : "Pause",
                tempPlayer.playback_status_icon = ithplayer.playbackStatus === 0 ? "media-playback-pause-symbolic" : "media-playback-start-symbolic";
                tempPlayer.cover_art_url = ithplayer.cover_art || "";
                
                set_all_players_array([...all_players_array.get()])
                set_current_player({ ...current_player.get() })

                if (tempPlayer.playerId === current_player_id.get()) {
                    set_current_player(tempPlayer);
                }
            } catch(e) {
                console.error(e);
            }
        };

        let playerHandles : number[] = [];
        playerHandles.push(ithplayer.connect("notify::trackid", handlePlayerUpdate));
        playerHandles.push(ithplayer.connect("notify::position", handlePlayerUpdate));
        playerHandles.push(ithplayer.connect("notify::playback-status", handlePlayerUpdate));

        active_connections.push({
            player: ithplayer,
            handlers: playerHandles
        })
    }

    set_number_of_player_binder(playerCnt);
    set_all_players_array(temp_all_players_array);
    if (current_player_id.get() >= playerCnt) set_current_player_id(0);

   if (playerCnt > 0) {
        const id = current_player_id.get();
        const active = temp_all_players_array.find(p => p.playerId === id) || temp_all_players_array[0];
        set_current_player({ ...active });
    } else {
        set_current_player({
            playerName : "",
            playerId : playerCnt,
            title : "Unknown title",
            album : "Unknown album",
            artist : "Unknown artist",
            position : 0,
            length : 0,
            percentages : 1,
            playback_status : "Playing",
            playback_status_icon : "media-playback-start-symbolic",
            cover_art_url : ""
        });
    }
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
            set_is_media_window_appearing(!is_media_window_appearing.get())
            setMediaWindowPosition();
        }} onScroll={(_, event) => {
            const dy = event.delta_y;

            const number_of_player = number_of_player_binder.get();
            if (number_of_player <= 1) return;
            
            let current_id = current_player_id.get();
            if (dy > 0) current_id = (current_id + 1) % number_of_player
            else if (dy < 0) current_id = (current_id - 1 + number_of_player) % number_of_player;

            set_current_player_id(current_id)
            set_current_player(all_players_array.get()[current_id])
            set_all_players_array([...all_players_array.get()])
        }}
        >
            <box class={"media"}>
                <With value={current_player}>
                    {(value) => value ? (
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
                    ) : (
                        <box>
                            <box class={"media-progress-outer"}>
                                <circularprogress
                                    class={"media-progress"}
                                    startAt={0.75}
                                    endAt={0.75}
                                    value={1}
                                >
                                    <icon
                                        class={"media-icon"}
                                        icon={"media-playback-start-symbolic"}
                                    />
                                </circularprogress>
                            </box>
                            <box>
                                <label class={"media-title"}
                                    maxWidthChars={20}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={"Unknown title"}
                                />
                                <label class={"media-artist"}
                                    maxWidthChars={15}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={" • " + "Unknown artist"}
                                />
                            </box>
                        </box>
                    )}
                </With>
            </box>
        </eventbox>
    )
}