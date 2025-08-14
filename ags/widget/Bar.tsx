import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { execAsync } from "ags/process";
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
                {(value) => value && <label label={value} halign={Gtk.Align.START} valign={Gtk.Align.START} class={"window-class"}></label>}
            </With>
            <With value={window_title}>
                {(value) => value && <label label={value} halign={Gtk.Align.START} valign={Gtk.Align.END} class={"window-title"} maxWidthChars={40} ellipsize={Pango.EllipsizeMode.END}></label>}
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
        <box spacing={5} class={"clock"}>
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

        if (active == true && focused == true) 
            // debug = "focused_and_active";
            debug = "background-color: @onPrimaryContainer; min-width: 30px; border: none; transition: 0.3s;"
        else if (active == true && focused == false)
            // debug = "active";
            debug = "background-color: @onPrimaryContainer; min-width: 10px; transition: 0.3s;"
        else if (active == false && focused == true) 
            // debug = "focused";
            debug = "min-width: 30px; transition: 0.3s;"
        else
            // debug = "empty";
            debug = "background-color: alpha(@onPrimaryContainer, .2); min-width: 10px; transition: 0.3s;"

        return debug;
    }

    return (
        <box>
            <With value={something_happened}>
                {(value) => value && 
                    <box class={"workspaces"} spacing={5}>
                        <box
                            // onClicked={() => {hyprland.dispatch("workspace", "1")}}
                            name={"button"}
                            // class={getCSSClassName(1)}
                            css={getCSSClassName(1)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "2")}}
                            name={"button"}
                            // class={getCSSClassName(2)}
                            css={getCSSClassName(2)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "3")}}
                            name={"button"}
                            // class={getCSSClassName(3)}
                            css={getCSSClassName(3)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "4")}}
                            name={"button"}
                            // class={getCSSClassName(4)}
                            css={getCSSClassName(4)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "5")}}
                            name={"button"}
                            // class={getCSSClassName(5)}
                            css={getCSSClassName(5)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "6")}}
                            name={"button"}
                            // class={getCSSClassName(6)}
                            css={getCSSClassName(6)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "7")}}
                            name={"button"}
                            // class={getCSSClassName(7)}
                            css={getCSSClassName(7)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "8")}}
                            name={"button"}
                            // class={getCSSClassName(8)}
                            css={getCSSClassName(8)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "9")}}
                            name={"button"}
                            // class={getCSSClassName(9)}
                            css={getCSSClassName(9)}
                        />
                        <box 
                            // onClicked={() => {hyprland.dispatch("workspace", "10")}}
                            // class={getCSSClassName(10)}
                            css={getCSSClassName(10)}
                        />
                    </box>
                }
            </With>
        </box>
    )
}

function Media() {
    const [media_string, set_media_string] = createState("");

    let media_interval: any;
    
    let isBeingChosenPlayer : number = 0;
    let media_list : any[] = mpris.players;
    
    mpris.connect("player-added", () => {
        media_interval = setInterval(() => {
            media_list = mpris.players;
            for (let i = 0; i < mpris.players.length; i++) {
                if (media_list[i].playbackStatus == 0) media_list[i].media_icon = "media-playback-pause-symbolic"
                else media_list[i].media_icon = "media-playback-start-symbolic";
            }
            
            if (media_string.get().length == 5) set_media_string("hello!")
            else set_media_string("hello")
        }, 1000);
    })

    mpris.connect("player-closed", () => {
        clearInterval(media_interval);
    })

    return (
        <eventbox class={"media-event-box"} onClick={() => {console.log("ohhhhhh")}}>
            <With value={media_string}>
                {(value) => value &&
                    <box class={"media"}>
                        <box class={"media-progress-outer"}>
                            <circularprogress
                                class={"media-progress"}
                                startAt={0.75}
                                endAt={0.75}
                                value={media_list[isBeingChosenPlayer].position / media_list[isBeingChosenPlayer].length}
                            >
                                <icon
                                    class={"media-icon"}
                                    icon={media_list[isBeingChosenPlayer].media_icon}
                                />
                            </circularprogress>
                        </box>
                        <label class={"media-title"}
                            maxWidthChars={20}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={mpris.players[isBeingChosenPlayer].title}
                        />
                        <label class={"media-artist"}
                            maxWidthChars={15}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={" • " + mpris.players[isBeingChosenPlayer].artist}
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
                label={"Không có gì quý hơn độc lập, tự do!"}
            />
        </box>
    )
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            name="bar"
            class="top-bar"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={app}
        >
            <centerbox>
                <Left $type="start"></Left>
                <Center $type="center"></Center>
                <Right $type="end"></Right>
            </centerbox>
        </window>
    )
}
