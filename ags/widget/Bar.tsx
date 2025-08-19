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
import { monitorFile } from "ags/file";

export const hyprland = AstalHyprland.get_default(),
             mpris = AstalMpris.get_default(),
             audio = AstalWp.get_default(),
             battery = AstalBattery.get_default();

export const [window_class, set_window_class] = createState("Workspace 0"),
             [window_title, set_window_title] = createState("Desktop"),
             [something_happened, change_something] = createState("hello"),
             speaker = audio.defaultSpeaker,
             [volume_handler, set_volume_handler] = createState("hello"),
             [brightness_handler, set_brightness_handler] = createState("hello"),
             [media_string, set_media_string] = createState(""),
             screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`),
             screenWidth = Number(exec(`bash -c "xrandr | grep -Po '(?<=current ).*?(?= x)'"`))
export let   volume_icon:string,
             volume_volume:number,
             window_list : boolean[] = new Array(11),
             isBeingChosenPlayer : number = 0,
             media_icon : string = "media-playback-start-symbolic", 
             media_title : string = "Unknown title",
             media_artist : string = "Unknown artist",
             media_position : number = 0,
             media_length : number = 0,
             media_percentages : number = 1,
             media_appear : boolean = false,
             osv_appear : boolean = false,
             osb_appear : boolean = false,
             osv_css : string = "",
             osb_css : string = "",
             brightness_brightness : number = Math.round((Number(exec('brightnessctl get')) / Number(exec('brightnessctl max')))*100),
             volumeTimeOuts:any = [], brightnessTimeOuts:any = [],
             volWinTimesOut:any = [], brightWinTimeOuts:any = []

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
    const cpu_usage = createPoll("", 2000, "bash -c \"grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'\""),
          ram_usage = createPoll("", 2000, "bash -c \"free | grep Mem | awk '{print $3/$2 * 100.0}'\""),
          swap_usage = createPoll("", 2000, "bash -c \"free | grep Swap | awk '{print $3/$2 * 100.0}'\"")

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
        let active : boolean = window_list[i],
            focused : boolean = i == hyprland.focusedWorkspace.id,
            debug : string;

        if (active == true && focused == true) debug = "focused_and_active";
        else if (active == true && focused == false) debug = "active";
        else if (active == false && focused == true) debug = "focused";
        else debug = "empty";

        return debug;
    }

    function getCSSProperties(i:number):string {
        let active : boolean = window_list[i],
            focused : boolean = i == hyprland.focusedWorkspace.id,
            debug : string;

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

// monitorFile(("/home/nptanphuc/.config/ags/mpris.signal"), () => {
setInterval(() => {
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
    
    if (media_string.get().length == 5) set_media_string("hello!")
    else set_media_string("hello")
}, 1000)

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

function Battery() {
    const [battery_handler, set_battery_handler] = createState("hello");
    battery.connect("notify", () => {
        if (battery_handler.get().length == 5) set_battery_handler("hello!");
        else set_battery_handler("hello");
    })

    return (
        <box class={"media"}>
            <With value={battery_handler}>
                {(value) => value &&
                    <box spacing={3}>
                        <circularprogress
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={battery.percentage}
                        >
                            <icon icon={battery.iconName} class={"media-icon"} css={"font-size: 10px;"}></icon>
                        </circularprogress>
                        <label css={"font-size: 14px;"}
                            label={`${Math.round(battery.percentage*100).toString()}%`}
                        />
                    </box>
                }
            </With>
        </box>
    )
}

function Tools() {
    return (
        <box spacing={5} class={"tools"}>
            <eventbox class={"ultilities_button"} onClick={() => {execAsync('hyprpicker -a')}}>
                <icon icon={"document-edit-symbolic"} class={"tools-icon"} />
            </eventbox>
            <eventbox class={"ultilities_button"} onClick={() => {execAsync("notify-send '(˶˃ ᵕ ˂˶)'")}}>
                <icon icon={"find-location-symbolic"} class={"tools-icon"} />
            </eventbox>
        </box>
    )
}

function setOnScreenVolumePosition() {
    for (var i=0; i<volumeTimeOuts.length; i++) clearTimeout(volumeTimeOuts[i])

    if (!osv_appear) {
        osv_appear = true
        app.apply_css(`
            .on-screen-volume {
                margin-right: 10px;
            }
        `)
    }

    volumeTimeOuts.push(
        setTimeout(() => {
            osv_appear = false
            app.apply_css(`
                .on-screen-volume {
                    margin-right: -70px;
                }
            `)
        }, 2000)
    )
}

function Volume() {
    speaker.connect("notify", () => {
        speaker.mute == true 
            ? volume_icon = `audio-volume-muted-symbolic`
            : speaker.volume <= 0.15
                ? volume_icon = `audio-volume-low-symbolic`
                : speaker.volume <= 0.25
                    ? volume_icon = `audio-volume-medium-symbolic`
                    : speaker.volume <= 0.67
                        ? volume_icon = `audio-volume-high-symbolic` 
                        : `audio-volume-overamplified-symbolic`
        osv_css = `background: linear-gradient(to bottom, @onSurface ${100-Math.round(volume_volume*100)}%, @primaryContainer ${100-Math.round(volume_volume*100)}%);`
        volume_volume = speaker.volume;
        setOnScreenVolumePosition();
        
        if (volume_handler.get().length == 5) set_volume_handler("hello!");
        else set_volume_handler("hello");
    })

    return (
        <box>
            <With value={volume_handler}>
                {(value) => value &&
                    <icon icon={volume_icon} />
                }
            </With>
        </box>
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
            <Battery></Battery>
            <Tools></Tools>
        </box>
    )
}

function Right() {
    return (
        <box class="modules-right" halign={Gtk.Align.END}>
            <Volume></Volume>
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

// START OF OSD_VOLUME_WINDOW.H

export function OnScreenVolume(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT, BOTTOM} = Astal.WindowAnchor

    return (
        <window
            visible
            name="on_screen_volume"
            class="on-screen-volume"
            gdkmonitor={gdkmonitor}
            anchor={RIGHT}
            application={app}
        >
            <box class="on-screen-volume">
                <With value={volume_handler}>
                    {(value) => value &&
                    <box class={"outer-osv-bar"}>
                        <box
                            class={"osv-bar"}
                            widthRequest={36}
                            heightRequest={200}
                            css={osv_css}
                        >
                            <icon $type="center"
                                valign={Gtk.Align.END}
                                icon={volume_icon}
                                marginBottom={10}
                            ></icon>
                        </box>
                    </box>
                    }
                </With>
            </box>
        </window>
    )
}

// END OF OSD_VOLUME_WINDOW.H

// START OF OSD_BRIGHTNESS_WINDOW.H

function setOnScreenBrightnessPosition() {
    for (var i=0; i<brightnessTimeOuts.length; i++) clearTimeout(brightnessTimeOuts[i])

    if (!osb_appear) {
        osb_appear = true
        app.apply_css(`
            .on-screen-brightness {
                margin-left: 10px;
            }
        `)
    }

    brightnessTimeOuts.push(
        setTimeout(() => {
            osb_appear = false
            app.apply_css(`
                .on-screen-brightness {
                    margin-left: -70px;
                }
            `)
        }, 2000)
    )
}

export function onScreenBrightness(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT, BOTTOM} = Astal.WindowAnchor

    monitorFile(
        `/sys/class/backlight/${screen}/brightness`,
                
        function() {
            console.log("oke")
            setOnScreenBrightnessPosition();

            brightness_brightness = Math.round((Number(exec('brightnessctl get')) / Number(exec('brightnessctl max')))*100)
            osb_css = `background: linear-gradient(to bottom, @onSurface ${100-brightness_brightness}%, @primaryContainer ${100-brightness_brightness}%);`

            if (brightness_handler.get().length == 5) set_brightness_handler("hello!")
            else set_brightness_handler("hello")
        }
    )

    return (
        <window
            visible
            name="on_screen_brightness"
            class="on-screen-brightness"
            gdkmonitor={gdkmonitor}
            anchor={LEFT}
            application={app}
        >
            <box class={"on-screen-brightness"}>
                <With value={brightness_handler}>
                    {(value) => value &&
                    <box class={"outer-osv-bar"}>
                        <box
                            class={"osv-bar"}
                            widthRequest={36}
                            heightRequest={200}
                            css={osb_css}
                        >
                            <icon $type="center"
                                valign={Gtk.Align.END}
                                icon={"display-brightness-symbolic"}
                                marginBottom={10}
                            ></icon>
                        </box>
                    </box>
                    }
                </With>
            </box>
        </window>
    )
}