import app from "ags/gtk3/app";
import { createState, With } from "gnim";
import Pango from "gi://Pango?version=1.0";
import { mpris } from "./MediaWindow";

export const [media_string, set_media_string] = createState("")

export let  volume_volume:number,
            isBeingChosenPlayer : number = 0,
            media_icon : string = "media-playback-start-symbolic", 
            media_title : string = "Unknown title",
            media_artist : string = "Unknown artist",
            media_position : number = 0,
            media_length : number = 0,
            media_percentages : number = 1,
            media_appear : boolean = false
        
mpris.connect("player-closed", () => {
    media_icon = "media-playback-start-symbolic";
    media_percentages = 1;
    media_title = "Unknown title";
    media_artist = "Unknown artist";

    if (media_string.get().length == 5) set_media_string("hello!")
    else set_media_string("hello")
})

if (media_string.get().length == 5) set_media_string("hello!");
else set_media_string("hello");

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

export function Media() {
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