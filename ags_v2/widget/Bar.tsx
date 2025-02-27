import { App } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Mpris from "gi://AstalMpris"
import Battery from "gi://AstalBattery"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Tray from "gi://AstalTray"
import { CircularProgress } from "astal/gtk3/widget"
import { textdomain } from "gettext"
import CinnamonDesktop from "gi://CinnamonDesktop?version=3.0"

function Workspaces() {
    const hypr = Hyprland.get_default()

    function checkActiveWorkspace(a:number) {
        for (let i = 0; i < hypr.get_clients().length; i++) {
            if (a == hypr.get_clients()[i].workspace.id) {
                return true;
            }
        }

        return false;
    }

    hypr.connect("event", async(_, event, args) => {
        console.log("hypr.focusedWorkspace.id:", hypr.focusedWorkspace.id)
        return (
            <eventbox>
                <box className="workspaces" spacing={5}>{
                    Array.from({length: 10}, (_, i) => i+1).map(i => (
                        <button
                            onClick = {() => hypr.dispatch("workspace", i.toString())}
                            className={hypr.focusedWorkspace.id == i
                                ? `${checkActiveWorkspace(i) ? "focused_and_active" : "focused"}`
                                : `${checkActiveWorkspace(i) ? "active" : "empty"}`
                            }
                        />
                    ))
                }</box>
            </eventbox>
        )
    })

    return (
        <eventbox>
            <box className="workspaces" spacing={5}>{
                Array.from({length: 10}, (_, i) => i+1).map(i => (
                    <button
                        onClick = {() => hypr.dispatch("workspace", i.toString())}
                        className={bind(hypr, "focusedWorkspace").as(hehe => (hehe.id == i)
                            ? `${checkActiveWorkspace(i) ? "focused_and_active" : "focused"}`
                            : `${checkActiveWorkspace(i) ? "active" : "empty"}`
                        )}
                    />
                ))
            }</box>
        </eventbox>
    )
}

function Media({player} : {player: Mpris.Player}) {
    const title = bind(player, "title").as(hehe => hehe != null ? hehe : "Unknown title")
    const artist = bind(player, "artist").as(hehe => ` • ${hehe != null ? hehe : "Unknown artist"}`)

    return (
        <box className="media">
            <box className="media-info">
                <label halign={Gtk.Align.START}
                    truncate={true}
                    maxWidthChars={20}
                    className="media-title"
                    label={title}
                />

                <label halign={Gtk.Align.START}
                    truncate={true}
                    maxWidthChars={20}
                    className="media-artist"
                    label={artist}
                />
            </box>
        </box>
    )
}

function Window() {
    const hypr = Hyprland.get_default();

    hypr.connect("event", async(_, event, args) => {
        console.log("hypr.focusedClient.title:", hypr.focusedClient.title)
        return (
            <box className="window" orientation={Gtk.Orientation.VERTICAL}>
                <label className="window_class" halign={Gtk.Align.START}
                    label={hypr.focusedClient.class != null ? hypr.focusedClient.class : "Wallpaper"}
                />
    
                <label className="window_title" truncate={true} maxWidthChars={40}
                    label={hypr.focusedClient.title != null ? hypr.focusedClient.title.replace(" — Mozilla Firefox", "") : `Workspace ${hypr.focusedWorkspace.id}`}
                />
            </box>
        )
    })

    return (
        <box className="window" orientation={Gtk.Orientation.VERTICAL}>
            <label className="window_class" halign={Gtk.Align.START}
                label={bind(hypr, "focusedClient").as(hehe => hehe != null ? hehe.class : "Wallpaper")}
            />

            <label className="window_title" truncate={true} maxWidthChars={40}
                label={bind(hypr, "focusedClient").as(hehe => hehe != null ? hehe.title.replace(" — Mozilla Firefox", "") : `Workspace ${hypr.focusedWorkspace.id}`)}
            />
        </box>
    )
}

function Clock() {    
    const time_time = Variable<string>("").poll(1000, () => GLib.DateTime.new_now_local().format("%H:%M")!);
    const time_date = Variable<string>("").poll(1000, () => GLib.DateTime.new_now_local().format(" • %a, %b %d")!);

    return (
        <box className="clock">
            <label
                className="time-time"
                label={time_time()}
            />

            <label
                className="time-date"
                label={time_date()}
            />
        </box>
    )
}

function Wifi() {
    const { wifi } = Network.get_default();

    return (
        <icon
            className="network"
            tooltipText={bind(wifi, "ssid").as(String)}
            icon={bind(wifi, "iconName")}
        />
    )
}

function Energy() {
    const battery = Battery.get_default();

    return (
        <box className="battery"
            tooltipText={bind(battery, "state").as(hehe => hehe == 1
                ? `Charging: ${Math.floor(battery.percentage*100)}%`
                : `${hehe == 2
                    ? `Uncharged: ${Math.floor(battery.percentage*100)}%`
                    : `Unknown state: ${Math.floor(battery.percentage*100)}%`
                }`
            )
            }
        >
            <icon className="battery-icon"
                icon={bind(battery, "iconName")}
            />
        </box>
    )
}

function Volume() {
    const volume = Wp.get_default()?.audio.defaultSpeaker!

    return (
        <eventbox className="volume" tooltipText={bind(volume, "volume").as(hehe => `Volume: ${Math.floor(hehe*100)}%`)}
            onClick={() => (volume.get_mute()==true) ? volume.set_mute(false) : volume.set_mute(true)}
            onScroll={() => (volume.set_volume(volume.get_volume() + 0.01))}
        >
            <icon className="volume-icon"
                icon={bind(volume, "volumeIcon")}
            />
        </eventbox>
    )
}

function Left() {
    return (
        <box className="modules-left" halign={Gtk.Align.START} valign={Gtk.Align.CENTER}>
            <Window></Window>
        </box>
    )
}

function Center() {
    const mpris = Mpris.get_default()
    return (
        <box className="modules-center" halign={Gtk.Align.CENTER}>
            <Clock></Clock>
            <Workspaces></Workspaces>
            {bind(mpris, "players").as(hehe => hehe.map(player => (
                <Media player={player}></Media>
            )))}
        </box>
    )
}

function Right() {
    return (
        <box className="modules-right" halign={Gtk.Align.END} spacing={10}>
            <Wifi></Wifi>
            <Energy></Energy>
            <Volume></Volume>
        </box>
    )
}

export default function Bar(monitor: Gdk.Monitor) {
    const {TOP, LEFT, RIGHT} = Astal.WindowAnchor;
    return (
        <window className="Bar" exclusivity={Astal.Exclusivity.EXCLUSIVE} anchor={TOP | LEFT | RIGHT} height_request={40}>
            <centerbox>
                <Left></Left>
                <Center></Center>
                <Right></Right>
            </centerbox>
        </window>
    )
}