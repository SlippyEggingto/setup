import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { With } from "gnim";

import { volume_handler, osv_css, volume_icon } from "./Volume";

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