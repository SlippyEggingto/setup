import app from "ags/gtk3/app";
import AstalWp from "gi://AstalWp?version=0.1";
import { createState } from "ags";
import { monitorFile } from "ags/file";
import { With } from "gnim";

import { media_appear } from "./Media";

const audio = AstalWp.get_default(),
      speaker = audio.defaultSpeaker

export let  osv_appear : boolean = false,
            volumeTimeOuts:any = [],
            volume_icon:string,
            volume_volume:number,
            osv_css : string

export const    [volume_handler, set_volume_handler] = createState("hello"),
                [volume_icon_state, set_volume_icon] = createState("audio-volume-high-symbolic")

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
monitorFile('/home/nptanphuc/Personalization/done_notif', () => {
    app.reset_css();
    app.apply_css('./style.css')
    setMediaWindowPosition();
})

export function Volume() {
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