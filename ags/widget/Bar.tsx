import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { exec, execAsync } from "ags/process";
import { createPoll, idle, timeout } from "ags/time";
import { Accessor, createBinding, createState } from "gnim";
import { With } from "gnim";
import Pango from "gi://Pango?version=1.0";

import AstalHyprland from "gi://AstalHyprland?version=0.1";
const hyprland = AstalHyprland.get_default()
import AstalMpris from "gi://AstalMpris?version=0.1";
const mpris = AstalMpris.get_default();
import AstalWp from "gi://AstalWp?version=0.1";
const audio = AstalWp.get_default();
import AstalBattery from "gi://AstalBattery?version=0.1";
import { monitorFile } from "ags/file";
const battery = AstalBattery.get_default();

const [window_class, set_window_class] = createState("Workspace 0");
const [window_title, set_window_title] = createState("Desktop");
const [something_happened, change_something] = createState("hello");
var window_list : boolean[] = new Array(11);

function Window() {
    hyprland.connect("event", () => {
        if (hyprland.focusedClient != null) {
            set_window_class(hyprland.focusedClient.class)
            set_window_title(hyprland.focusedClient.title)
        } else {
            set_window_class("Desktop")
            set_window_title(`Workspace ${hyprland.focusedWorkspace.id}`)
        }

        for (let i = 1; i <= 10; i++) window_list[i] = false;
        for (let i of hyprland.get_clients()) if (i.workspace != null) if (i.workspace.id != -98) window_list[i.workspace.id] = true;

        if (hyprland.focusedClient != null) {
            if (hyprland.focusedClient.workspace != null) {
                if (hyprland.focusedClient.workspace.id != -98) {
                    window_list[hyprland.focusedClient.workspace.id] = true;
                }
            }
        }
        
        if (something_happened.get().length == 5) change_something("hello!");
        else change_something("hello");
    })

    return (
        <box orientation={Gtk.Orientation.VERTICAL}>
            <With value={window_class}>
                {(value) => value && <label label={value} halign={Gtk.Align.START} valign={Gtk.Align.START} class={"window-class"} maxWidthChars={45} ellipsize={Pango.EllipsizeMode.END}></label>}
            </With>
            <With value={window_title}>
                {(value) => value && <label label={value} halign={Gtk.Align.START} valign={Gtk.Align.END} class={"window-title"} maxWidthChars={45} ellipsize={Pango.EllipsizeMode.END}></label>}
            </With>
        </box>
    )
}

function Usage() {
    const cpu_usage = createPoll("", 2000, "bash -c \"grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'\"")
    const ram_usage = createPoll("", 2000, "bash -c \"free | grep Mem | awk '{print $3/$2 * 100.0}'\"")
    const swap_usage = createPoll("", 2000, "bash -c \"free | grep Swap | awk '{print $3/$2 * 100.0}'\"")

    return (
        <box spacing={5} class={"media"}>
            <box>
                <With value={cpu_usage}>
                    {(value) => value &&
                        <circularprogress
                            visible
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={Number(value)/100}
                            tooltipText={`CPU Usage ${Math.round(Number(value))}%`}
                        >
                            <icon
                                css={"font-size: 8px;"}
                                icon={"media-record"}
                            />
                        </circularprogress>
                    }
                </With>
            </box>
            <box>
                <With value={ram_usage}>
                    {(value) => value &&
                        <circularprogress
                            visible
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={Number(value)/100}
                            tooltipText={`RAM Usage ${Math.round(Number(value))}%`}
                        >
                            <icon
                                css={"font-size: 8px;"}
                                icon={"media-record"}
                            />
                        </circularprogress>
                    }
                </With>
            </box>
            <box>
                <With value={swap_usage}>
                    {(value) => value &&
                        <circularprogress
                            visible
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={Number(value)/100}
                            tooltipText={`Swap Usage ${Math.round(Number(value))}%`}
                        >
                            <icon
                                css={"font-size: 8px;"}
                                icon={"media-record"}
                            />
                        </circularprogress>
                    }
                </With>
            </box>
        </box>
    )
}

function Clock() {
    const time_time = createPoll("", 1000, "date +'%H:%M'")
    const time_date = createPoll("", 60000, "date +'%a, %b %d'")
    return (
        <box spacing={3} class={"clock"}>
            <label
                class={"time-time"}
                label={time_time}
            />
            <label label={"•"}/>
            <label
                class={"time-date"}
                label={time_date}
            />
        </box>
    )
}

function Workspaces() {
    function getCSSClassName(i:number):string {
        let active : boolean = window_list[i];
        let focused : boolean = i == hyprland.focusedWorkspace.id;
        let debug : string;

        if (active == true && focused == true) debug = "focused_and_active";
        else if (active == true && focused == false) debug = "active";
        else if (active == false && focused == true) debug = "focused";
        else debug = "empty";

        return debug;
    }

    function getCSSProperties(i:number):string {
        let active : boolean = window_list[i];
        let focused : boolean = i == hyprland.focusedWorkspace.id;
        let debug : string;

        if (active == true && focused == true) debug = "background-color: @onPrimaryContainer; min-width: 30px; border: none; transition: 0.3s;"
        else if (active == true && focused == false) debug = "background-color: @onPrimaryContainer; min-width: 10px; transition: 0.3s;"
        else if (active == false && focused == true) debug = "min-width: 30px; transition: 0.3s;"
        else debug = "background-color: alpha(@onPrimaryContainer, .2); min-width: 10px; transition: 0.3s;"

        return debug;
    }

    return (
        <box>
            <With value={something_happened}>
                {(value) => value && 
                    <box>
                        <box class={"workspaces"} spacing={5}>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 1`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(1)}
                                    // css={getCSSProperties(1)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 2`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(2)}
                                    // css={getCSSProperties(2)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 3`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(3)}
                                    // css={getCSSProperties(3)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 4`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(4)}
                                    // css={getCSSProperties(4)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 5`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(5)}
                                    // css={getCSSProperties(5)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 6`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(6)}
                                    // css={getCSSProperties(6)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 7`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(7)}
                                    // css={getCSSProperties(7)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 8`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(8)}
                                    // css={getCSSProperties(8)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 9`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(9)}
                                    // css={getCSSProperties(9)}
                                />
                            </eventbox>
                            <eventbox
                                onClick={() => {execAsync(`hyprctl dispatch workspace 10`)}}
                                heightRequest={10}
                            >
                                <box
                                    class={getCSSClassName(10)}
                                    // css={getCSSProperties(10)}
                                />
                            </eventbox>
                        </box>
                    </box>
                }
            </With>
        </box>
    )
}

const [media_string, set_media_string] = createState("");

let isBeingChosenPlayer : number = 0;
let media_icon : string = "media-playback-start-symbolic", 
    media_title : string = "Unknown title",
    media_artist : string = "Unknown artist",
    media_position : number = 0,
    media_length : number = 0,
    media_percentages : number = 1,
    media_appear : boolean = false;

function setMediaWindowPosition() {
    if (media_appear) {
        app.apply_css(`
            .media-window {
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
            .media-window {
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

setMediaWindowPosition();
monitorFile('/home/nptanphuc/Personalization/type4.css', () => {
    app.reset_css();
    app.apply_css('./style.css')
    setMediaWindowPosition();
})

if (media_string.get().length == 5) set_media_string("hello!");
else set_media_string("hello");

monitorFile(("/home/nptanphuc/.config/ags/mpris.signal"), () => {
    if (mpris.players.length > 0) {
        let oke = mpris.players[isBeingChosenPlayer];
        if (oke.playbackStatus == 0) media_icon = "media-playback-pause-symbolic";
        else media_icon = "media-playback-start-symbolic";
        if (oke.length != 0) media_percentages = oke.position / oke.length;
        media_position = oke.position;
        media_length = oke.length;
        if (oke.title == null || oke.title == "") media_title = "Unknown title";
        else media_title = mpris.players[isBeingChosenPlayer].title;
        if (oke.artist == null || oke.artist == "") media_artist = "Unknown artist";
        else media_artist = mpris.players[isBeingChosenPlayer].artist;
    } else {
        media_icon = "media-playback-start-symbolic";
        media_percentages = 1;
        media_title = "Unknown title";
        media_artist = "Unknown artist";
    }

    console.log("worked")
    
    if (media_string.get().length == 5) set_media_string("hello!")
    else set_media_string("hello")
})

mpris.connect("player-closed", () => {
    media_icon = "media-playback-start-symbolic";
    media_percentages = 1;
    media_title = "Unknown title";
    media_artist = "Unknown artist";

    if (media_string.get().length == 5) set_media_string("hello!")
    else set_media_string("hello")
})

function Media() {
    return (
        <eventbox class={"media-event-box"} onClick={() => {
            if (media_appear) {
                app.apply_css(`
                    .media-window {
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
            } else {
                app.apply_css(`
                    .media-window {
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
            }

            media_appear = !media_appear;
        }}
        >
            <With value={media_string}>
                {(value) => value &&
                    <box class={"media"}>
                        <box class={"media-progress-outer"}>
                            <circularprogress
                                class={"media-progress"}
                                startAt={0.75}
                                endAt={0.75}
                                value={media_percentages}
                            >
                                <icon
                                    class={"media-icon"}
                                    icon={media_icon}
                                />
                            </circularprogress>
                        </box>
                        <label class={"media-title"}
                            maxWidthChars={20}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={media_title}
                        />
                        <label class={"media-artist"}
                            maxWidthChars={15}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={" • " + media_artist}
                        />
                    </box>
            }</With>
        </eventbox>
    )
}

function Volume() {
    const defaultSpeaker = audio.defaultSpeaker

    const [volume_handler, set_volume_handler] = createState("hello");
    
    let vol = defaultSpeaker.volume * 100;
    let mut = defaultSpeaker.mute
    let icon : string;

    setInterval(() => {
        vol = defaultSpeaker.volume * 100;
        mut = defaultSpeaker.mute

        if (mut == true) icon = 'audio-volume-muted-symbolic'
        else if (vol <= 15) icon = 'audio-volume-low-symbolic'
        else if (vol <= 25) icon = 'audio-volume-medium-symbolic'
        else if (vol <= 67) icon = 'audio-volume-high-symbolic'
        else icon = 'audio-volume-overamplified-symbolic'

        if (volume_handler.get().length == 5) set_volume_handler("hello!");
        else set_volume_handler("hello");
    }, 100);


    return (
        <eventbox class={"volume"}>
            <With value={volume_handler}>
                {(value) => value && 
                    <icon
                        icon={icon}
                        tooltip_text = {`Volume ${Math.floor(vol)}%`}
                    />
                }
            </With>
        </eventbox>
    )
}

function Left() {
    return (
        <box class="modules-left">
            <Window/>
        </box>
    )
}

function Center() {
    return (
        <box class="modules-center">
            <Usage></Usage>
            <Clock></Clock>
            <Workspaces></Workspaces>
            <Media></Media>
        </box>
    )
}

function Right() {
    return (
        <box class="modules-right" halign={Gtk.Align.END}>
            {/* <Volume></Volume> */}
            <label
                // label={"Không có gì quý hơn độc lập, tự do!"}
            />
        </box>
    )
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            name="top_bar"
            class="top-bar"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={app}
            // heightRequest={40}
        >
            <centerbox>
                <Left $type="start"></Left>
                <Center $type="center"></Center>
                <Right $type="end"></Right>
            </centerbox>
        </window>
    )
}

// END OF BAR_WINDOW.H

// START OF MEDIA_WINDOW.H

function TrackCover() {
    return (
        <box>
            <With value={media_string}>
                {(value) => value &&
                    <box
                        css={`background-image: url('${mpris.players[isBeingChosenPlayer].artUrl.replace('file://', '')}'); min-width: 120px; min-height: 120px; background-size: auto 100%; background-repeat: no-repeat; background-clip: content-box; background-position: 50% 50%; border-radius: 12px; box-shadow: 0px 0px 4px rgba(0, 0, 0, .4);`}
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
        <box>
            <With value={media_string}>
                {(value) => value &&
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <slider
                            widthRequest={300}
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