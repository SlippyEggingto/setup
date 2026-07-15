import { createState, With } from "ags";
import { battery } from "./GlobalVariable";

export function Battery() {
    const [battery_handler, set_battery_handler] = createState("hello");
    battery.connect("notify", () => {
        if (battery_handler.get().length == 5) set_battery_handler("hello!");
        else set_battery_handler("hello");
    })

    return (
        <box class={"media"}>
            <With value={battery_handler}>
                {(value) => value &&
                    <box spacing={3}>
                        <circularprogress
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={battery.percentage}
                        >
                            <icon icon={battery.iconName} class={"media-icon"} css={"font-size: 10px;"}></icon>
                        </circularprogress>
                        <label css={"font-size: 14px;"}
                            label={`${Math.round(battery.percentage*100).toString()}%`}
                        />
                    </box>
                }
            </With>
        </box>
    )
}