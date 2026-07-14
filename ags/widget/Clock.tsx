import { Gtk } from "ags/gtk3";
import { createState, With } from "gnim";

const [clock_first_half, set_clokc_first_half] = createState("")
const [clock_second_half, set_clokc_second_half] = createState("")

const sleep = (ms:number) => new Promise((resolv) => setTimeout(resolv, ms));

async function main() {
    const DATE = new Date();
    await sleep(1000-DATE.getMilliseconds());

    while (true) {
        const newDate = new Date();
        set_clokc_first_half(newDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}))
        set_clokc_second_half(newDate.toLocaleDateString([], {weekday: 'short', month: 'short', day:'2-digit'}))
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
            <label halign={Gtk.Align.CENTER} label={"•"} />
            <With value={clock_second_half}>
                {(value) => value && <label class={"time-date"} halign={Gtk.Align.END} label={value.toString()} />}
            </With>
        </box>
    )
}