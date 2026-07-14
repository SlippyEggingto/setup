import { createPoll } from "ags/time"
import { With } from "gnim"

export function Usage() {
    const cpu_usage = createPoll("", 2000, "bash -c \"grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'\""),
          ram_usage = createPoll("", 2000, "bash -c \"free | grep Mem | awk '{print $3/$2 * 100.0}'\""),
          swap_usage = createPoll("", 2000, "bash -c \"free | grep Swap | awk '{print $3/$2 * 100.0}'\"")

    return (
        <box spacing={5} class={"media"}>
            <box>
                <With value={cpu_usage}>
                    {(value) => value &&
                        <circularprogress
                            visible
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={Number(value)/100}
                            tooltipText={`CPU Usage ${Math.round(Number(value))}%`}
                        >
                            <icon
                                css={"font-size: 8px;"}
                                icon={"media-record"}
                            />
                        </circularprogress>
                    }
                </With>
            </box>
            <box>
                <With value={ram_usage}>
                    {(value) => value &&
                        <circularprogress
                            visible
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={Number(value)/100}
                            tooltipText={`RAM Usage ${Math.round(Number(value))}%`}
                        >
                            <icon
                                css={"font-size: 8px;"}
                                icon={"media-record"}
                            />
                        </circularprogress>
                    }
                </With>
            </box>
            <box>
                <With value={swap_usage}>
                    {(value) => value &&
                        <circularprogress
                            visible
                            class={"media-progress"}
                            startAt={0.75}
                            endAt={0.75}
                            value={Number(value)/100}
                            tooltipText={`Swap Usage ${Math.round(Number(value))}%`}
                        >
                            <icon
                                css={"font-size: 8px;"}
                                icon={"media-record"}
                            />
                        </circularprogress>
                    }
                </With>
            </box>
        </box>
    )
}