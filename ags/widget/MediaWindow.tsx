import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { execAsync } from "ags/process";
import { createPoll, idle, timeout } from "ags/time";
import { Accessor, createBinding, createState } from "gnim";
import { With } from "gnim";
import Pango from "gi://Pango?version=1.0";

import AstalMpris from "gi://AstalMpris?version=0.1";
const mpris = AstalMpris.get_default();

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

mpris.connect("player-closed", () => {
    clearInterval(media_interval);
})

function InformationPanel() {
    
    return (
        <box css="margin-left: 10px;">
            <With value={media_string}>
                {(value) => value &&
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <label
                            css={"font-weight: 800;"}
                            halign={Gtk.Align.START}
                            // maxWidthChars={20}
                            // ellipsize={Pango.EllipsizeMode.END}
                            label={mpris.players[isBeingChosenPlayer].title}
                        />
                        <label
                            halign={Gtk.Align.START}
                            // maxWidthChars={15}
                            // ellipsize={Pango.EllipsizeMode.END}
                            label={mpris.players[isBeingChosenPlayer].artist}
                        />
                    </box>
                }
            </With>
        </box>
    )
}

function ControlPanel() {
    return (
        <box>
            <With value={media_string}>
                {(value) => value &&
                    <slider
                        widthRequest={300}
                        class={"media-slider"}
                        value={mpris.players[isBeingChosenPlayer].position/mpris.players[isBeingChosenPlayer].length}
                        // onDragged={({value}) => {
                        //     // mpris.players[isBeingChosenPlayer].set_position = value*mpris.players[isBeingChosenPlayer].length
                        //     console.log(value);
                        // }}
                    />
                }
            </With>
        </box>
    )
}

function RightPanel() {
    return (
        <box widthRequest={300} orientation={Gtk.Orientation.VERTICAL}>
            <InformationPanel></InformationPanel>
            <ControlPanel></ControlPanel>
        </box>
    )
}

export default function MediaWindow(gdkmonitor: Gdk.Monitor) {
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
            <box spacing={10}>
                <TrackCover></TrackCover>
                <RightPanel></RightPanel>
                {/* <label
                    label={"\"Không có gì quý hơn độc lập tự do!\""}
                /> */}
            </box>
        </window>
    )
}
