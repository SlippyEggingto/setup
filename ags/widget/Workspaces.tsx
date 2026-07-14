import AstalHyprland from "gi://AstalHyprland?version=0.1";
const hyprland = AstalHyprland.get_default()

import { execAsync } from "ags/process";
import { With } from "gnim";

import { something_happened, window_list } from "./Window";

export function Workspaces() {
    function getCSSClassName(i:number):string {
        let active : boolean = window_list[i],
            focused : boolean = i == hyprland.focusedWorkspace.id,
            debug : string;

        if (active == true && focused == true) debug = "focused_and_active";
        else if (active == true && focused == false) debug = "active";
        else if (active == false && focused == true) debug = "focused";
        else debug = "empty";

        return debug;
    }

    return (
        <box>
            <With value={something_happened}>
                {(value) => value && 
                    <box>
                        <box class={"workspaces"} spacing={5}>
                            {Array.from({length: 10}, (_, i) => (
                                <eventbox
                                    onClick={() => {execAsync(`hyprctl dispatch workspace ${i + 1}`)}}
                                    heightRequest={10}
                                >
                                    <box
                                        class={getCSSClassName(i + 1)}
                                    />
                                </eventbox>
                            ))}
                        </box>
                    </box>
                }
            </With>
        </box>
    )
}
