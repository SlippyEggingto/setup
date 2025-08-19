import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { exec, execAsync } from "ags/process";
import { createPoll, idle, timeout } from "ags/time";
import { Accessor, createBinding, createState } from "gnim";
import { With } from "gnim";
import Pango from "gi://Pango?version=1.0";

import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalMpris from "gi://AstalMpris?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import AstalBattery from "gi://AstalBattery?version=0.1";

export const hyprland = AstalHyprland.get_default(),
             mpris = AstalMpris.get_default(),
             audio = AstalWp.get_default(),
             battery = AstalBattery.get_default();

import { media_string, isBeingChosenPlayer, media_title, media_artist, media_percentages, media_position, media_icon, media_length } from "./Bar";

function TrackCover() {
    return (
        <box>
            <With value={media_string}>
                {(value) => value &&
                    <box
                        css={`background-image: url('${mpris.players[isBeingChosenPlayer].artUrl == null ? '' : mpris.players[isBeingChosenPlayer].artUrl.replace('file://', '')}'); min-width: 120px; min-height: 120px; background-size: auto 100%; background-repeat: no-repeat; background-clip: content-box; background-position: 50% 50%; border-radius: 12px; box-shadow: 0px 0px 4px rgba(0, 0, 0, .4);`}
                    />
                }
            </With>
        </box>
    )
}

function InformationPanel() {  
    return (
        <box css="margin-left: 10px;">
            <With value={media_string}>
                {(value) => value &&
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <label
                            css={"font-weight: 800;"}
                            halign={Gtk.Align.START}
                            maxWidthChars={30}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={media_title}
                        />
                        <label
                            halign={Gtk.Align.START}
                            maxWidthChars={30}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={media_artist}
                        />
                    </box>
                }
            </With>
        </box>
    )
}

function numberToTime(a:number) : string {
    if (a==-1 || isNaN(a)) return '00:00'
    let h = Math.floor(a/3600);
    let m = Math.floor((a-h*3600)/60);
    let s = Math.floor(a-h*3600-m*60);
    let hh = '';
    let mm = '';
    let ss = '';
    if (h<10) hh = '0';
    if (m<10) mm = '0';
    if (s<10) ss = '0';
    if (h==0) return mm + m.toString() + ':' + ss + s.toString();
    else return hh + h.toString() + ':' + mm + m.toString() + ':' + ss+s.toString();
}

let media_dragged:boolean = false;

function ControlPanel() {
    return (
        <box valign={Gtk.Align.END}>
            <box $type="center">
                <With value={media_string}>
                    {(value) => value &&
                        <box orientation={Gtk.Orientation.VERTICAL} spacing={12}>
                            <slider halign={Gtk.Align.CENTER}
                                widthRequest={280}
                                class={"media-slider"}
                                value={media_percentages}
                                onDragged={({value}) => {
                                    // mpris.players[isBeingChosenPlayer].pause();
                                    mpris.players[isBeingChosenPlayer].set_position(value*mpris.players[isBeingChosenPlayer].length)
                                    // console.log(value);
                                }}
                            />
                            <centerbox spacing={10}>
                                <label $type="start" halign={Gtk.Align.END}
                                    label={numberToTime(Math.round(media_position))}
                                />
                                <box $type="center" spacing={5}>
                                    <eventbox class={"media-window-button"} onClick={() => {mpris.players[isBeingChosenPlayer].previous()}}>
                                        <icon icon={"media-skip-backward-symbolic"} class={"media-window-button-icon"} />
                                    </eventbox>
                                    <eventbox class={"media-window-button"} onClick={() => {mpris.players[isBeingChosenPlayer].play_pause()}}>
                                        <icon icon={media_icon} class={"media-window-button-icon"} />
                                    </eventbox>
                                    <eventbox class={"media-window-button"} onClick={() => {mpris.players[isBeingChosenPlayer].next()}}>
                                        <icon icon={"media-skip-forward-symbolic"} class={"media-window-button-icon"} />
                                    </eventbox>
                                </box>
                                <label $type="end" halign={Gtk.Align.START}
                                    label={numberToTime(Math.round(media_length))}
                                />
                            </centerbox>
                        </box>
                    }
                </With>
            </box>
        </box>
    )
}

function RightPanel() {
    return (
        <centerbox widthRequest={300} orientation={Gtk.Orientation.VERTICAL}>
            <InformationPanel $type="start"></InformationPanel>
            <box $type="center"></box>
            <ControlPanel $type="end"></ControlPanel>
        </centerbox>
    )
}

export function MediaWindow(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            name="media_window"
            class="media-window"
            gdkmonitor={gdkmonitor}
            anchor={TOP}
            application={app}
            margin={10}
        >
            <box spacing={10} class={"media-window"}>
                <TrackCover></TrackCover>
                <RightPanel></RightPanel>
            </box>
        </window>
    )
}