import app from "ags/gtk3/app"
import style from "./style.css"
import Bar from "./widget/Bar"
import { MediaWindow } from "./widget/Bar"
import { monitorFile } from "ags/file"

app.start({
    css: style,
    main() {
        app.get_monitors().map(Bar)
        app.get_monitors().map(MediaWindow)
    },
})
