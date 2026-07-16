import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { Accessor } from "gnim";

import { Window } from "./Window";
import { Usage } from "./Usage";
import { Clock } from "./Clock";
import { Workspaces } from "./Workspaces";
import { Media } from "./Media";
import { Battery } from "./Battery";
import { Volume } from "./Volume";
import { Tools } from "./Tools";
import { monitorFile } from "ags/file";

import { setMediaWindowPosition } from "./GlobalVariable";

setMediaWindowPosition();
monitorFile('/home/nptanphuc/Personalization/done_notif', () => {
    app.reset_css();
    app.apply_css('./style.css')
    setMediaWindowPosition();
})

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
