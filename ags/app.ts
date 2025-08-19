import app from "ags/gtk3/app"
import style from "./style.css"
import Bar from "./widget/Bar"
import { MediaWindow } from "./widget/MediaWindow"
import { OnScreenVolume } from "./widget/Bar"
import { onScreenBrightness } from "./widget/Bar"

app.start({
    css: style,
    main() {
        app.get_monitors().map(Bar)
        app.get_monitors().map(MediaWindow)
        app.get_monitors().map(OnScreenVolume)
        app.get_monitors().map(onScreenBrightness)
    },
})
