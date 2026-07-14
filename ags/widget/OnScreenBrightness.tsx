import app from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3";
import { exec } from "ags/process"
import { createState, With } from "gnim";
import { monitorFile } from "ags/file";

let osb_appear : boolean = false,
    osb_css : string = "",
    brightness_brightness : number = Math.round((Number(exec('brightnessctl get')) / Number(exec('brightnessctl max')))*100),
    brightnessTimeOuts:any = []
    
const   [brightness_handler, set_brightness_handler] = createState("hello"),
        screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`)

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