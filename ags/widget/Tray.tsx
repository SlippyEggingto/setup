import { exec } from "ags/process";
import AstalTray from "gi://AstalTray?version=0.1";
import { createState, With } from "gnim";
const tray =  AstalTray.get_default();

export function Tray() {
    const [tray_handler, set_tray_handler] = createState(false);
    
    tray.connect("notify", () => {
        set_tray_handler(!tray_handler());
    })

    return (
        <box css={"margin-left: 5px;"}>
            <With value={tray_handler}>
                {(value) => (
                    <box spacing={7}>
                        {
                            tray.get_items().map((oke) => 
                                <button
                                    tooltipMarkup={oke.tooltipMarkup}
                                    onClick={(_, event) =>
                                        {
                                            if (event.button === 1) oke.activate(0, 0)
                                        }
                                    }
                                >
                                    <icon icon={oke.iconName}></icon>
                                </button>
                            )
                        }
                    </box>
                )}
            </With>
        </box>
    )
}
