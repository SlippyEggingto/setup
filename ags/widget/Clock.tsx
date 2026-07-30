import { Gtk } from "ags/gtk3";
import { createBinding, createComputed, createSettings, createState, With } from "gnim";

import  {   set_clock_first_half,
            set_clock_second_half,
            clock_first_half,
            clock_second_half
        } from "./GlobalVariable";

export const sleep = (ms:number) => new Promise((resolv) => setTimeout(resolv, ms));

const [phase, set_phase] = createState(true)

async function main() {
    const DATE = new Date();
    await sleep(1000-DATE.getMilliseconds());

    while (true) {
        const newDate = new Date();
        newDate.getSeconds() % 2 === 0 ? set_phase(true) : set_phase(false);
        set_clock_first_half(newDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}))
        set_clock_second_half(newDate.toLocaleDateString([], {weekday: 'short', month: 'short', day:'2-digit'}))
        await sleep(1000-new Date().getMilliseconds());
    }
}

main();

export function Clock() {
    return (
        <box spacing={3} class={"clock"}>
            <box>
                <With value={clock_first_half}>
                    {(value) => value && <label class={"time-time"} halign={Gtk.Align.START} label={value.toString()} />}
                </With>
            </box>
            <label halign={Gtk.Align.CENTER} label={createComputed(() => phase() ? "•" : " ")} css={"min-width: 6px;"} />
            <With value={clock_second_half}>
                {(value) => value && <label class={"time-date"} halign={Gtk.Align.END} label={value.toString()} />}
            </With>
        </box>
    )
}
