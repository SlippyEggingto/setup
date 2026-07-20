import app from "ags/gtk3/app";
import { With } from "gnim";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import Pango from "gi://Pango?version=1.0";
import AstalMpris from "gi://AstalMpris?version=0.1";

const mpris = AstalMpris.get_default()

import { all_players_array, current_player_id } from "./GlobalVariable";
import { PlayerDataType } from "./GlobalVariable";

function numberToTime(seconds : number) {
    seconds = Math.max(seconds, 0);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds / 60) % 60;
    let s = seconds % 60;
    if (hours > 0) return `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`; 
    else return `${minutes.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function TrackCover({player} : {player : PlayerDataType}) {
    return ((player.playerId === current_player_id.get() || player.playerId == -1 ?  (
        <box>
            <box
                css={`background-image: url('${player.cover_art_url}');
                min-width: 120px;
                min-height: 120px;
                background-size: auto 100%;
                background-repeat: no-repeat;
                background-clip: content-box;
                background-position: 50% 50%;
                border-radius: 12px;
                box-shadow: 0px 0px 4px rgba(0, 0, 0, .4);`}
            />
        </box>
    ):<></>))
}

function InformationPanel({player} : {player : PlayerDataType}) {  
    return ((player.playerId === current_player_id.get() || player.playerId == -1 ?  (
        <box css="margin-left: 10px;">
            <box orientation={Gtk.Orientation.VERTICAL}>
                <label
                    css={"font-weight: 800;"}
                    halign={Gtk.Align.START}
                    maxWidthChars={30}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={player.title}
                />
                <label
                    halign={Gtk.Align.START}
                    maxWidthChars={30}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={player.artist}
                />
            </box>
        </box>
    ):<></>))
}

function ControlPanel({player} : {player : PlayerDataType}) {
    const getMprisPlayer = () => {
        return mpris.players.find(p => p.busName === player.playerName);
    };

    return ((player.playerId === current_player_id.get() || player.playerId == -1 ?  (
        <box valign={Gtk.Align.END}>
            <box $type="center">
                <box orientation={Gtk.Orientation.VERTICAL} spacing={12}>
                    <slider halign={Gtk.Align.END}
                        widthRequest={280}
                        class={"media-slider"}
                        value={player.percentages}
                        onDragged={({value}) => {
                            const p = getMprisPlayer();
                            if (p) p.set_position(value * p.length)
                        }}
                    />
                    <centerbox spacing={10}>
                        <label $type="start" halign={Gtk.Align.END}
                            label={numberToTime(Math.round(player.position))}
                        />
                        <box $type="center" spacing={5}>
                            <eventbox class={"media-window-button"} onClick={() => {getMprisPlayer()?.previous()}}>
                                <icon icon={"media-skip-backward-symbolic"} class={"media-window-button-icon"} />
                            </eventbox>
                            <eventbox class={"media-window-button"} onClick={() => {getMprisPlayer()?.play_pause()}}>
                                <icon icon={player.playback_status_icon} class={"media-window-button-icon"} />
                            </eventbox>
                            <eventbox class={"media-window-button"} onClick={() => {getMprisPlayer()?.next()}}>
                                <icon icon={"media-skip-forward-symbolic"} class={"media-window-button-icon"} />
                            </eventbox>
                        </box>
                        <label $type="end" halign={Gtk.Align.START}
                            label={numberToTime(Math.round(player.length))}
                        />
                    </centerbox>
                </box>
            </box>
        </box>
    ):<></>))
}

function RightPanel({player} : {player : PlayerDataType}) {
    return ((player.playerId === current_player_id.get() || player.playerId == -1 ?  (
        <centerbox widthRequest={300} orientation={Gtk.Orientation.VERTICAL}>
            <InformationPanel player={player} $type="start"></InformationPanel>
            <box $type="center"></box>
            <ControlPanel player={player} $type="end"></ControlPanel>
        </centerbox>
    ):<box>
        <icon icon={player.playback_status_icon} />
    </box>))
}

let tempPlayer = new PlayerDataType();
tempPlayer.playerName = "";
tempPlayer.playerId = -1;
tempPlayer.title = "Unknown title";
tempPlayer.album = "Unknown album";
tempPlayer.artist = "Unknown artist";
tempPlayer.position = 0
tempPlayer.length = 0
tempPlayer.percentages = 1
tempPlayer.playback_status = "Pause";
tempPlayer.playback_status_icon = "media-playback-start-symbolic";
tempPlayer.cover_art_url = "";

export function MediaWindow(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            name="media_window"
            class="media-outer-window"
            gdkmonitor={gdkmonitor}
            anchor={TOP}
            application={app}
            margin={10}
        >   
        <box>
            <With value={all_players_array}>
                {(playerList) => (
                    <box orientation={Gtk.Orientation.HORIZONTAL} spacing={15}>
                        {playerList && playerList.length > 0 ? (
                            playerList.map((player) => (
                                <box spacing={10} class={"media-window"}>
                                    <TrackCover player={player}></TrackCover>
                                    <RightPanel player={player}></RightPanel>
                                </box>
                            ))
                        ) : 
                            <box spacing={10} class={"media-window"}>
                                <TrackCover player={tempPlayer}></TrackCover>
                                <RightPanel player={tempPlayer}></RightPanel>
                            </box>
                        }
                    </box>
                )}
            </With>
        </box>
        </window>
    )
}