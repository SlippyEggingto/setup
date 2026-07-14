import { execAsync } from "ags/process";

export function Tools() {
    return (
        <box spacing={5} class={"tools"}>
            <eventbox class={"ultilities_button"} onClick={() => {execAsync('hyprpicker -a')}}>
                <icon icon={"document-edit-symbolic"} class={"tools-icon"} />
            </eventbox>
            <eventbox class={"ultilities_button"} onClick={() => {execAsync("notify-send '(˶˃ ᵕ ˂˶)'")}}>
                <icon icon={"find-location-symbolic"} class={"tools-icon"} />
            </eventbox>
        </box>
    )
}