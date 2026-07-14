import { Gtk } from "ags/gtk3";
import { With, createState } from "gnim";
import Pango from "gi://Pango?version=1.0";

import AstalHyprland from "gi://AstalHyprland?version=0.1";

export const    hyprland = AstalHyprland.get_default(),
                [window_class, set_window_class] = createState("Workspace 0"),
                [window_title, set_window_title] = createState("Desktop"),
                [something_happened, change_something] = createState("hello")

export let      window_list : boolean[] = new Array(11).fill(false);

export function Window() {
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