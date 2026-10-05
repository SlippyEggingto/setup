import AstalNetwork from "gi://AstalNetwork?version=0.1"
import { createState, With } from "gnim";
const network =  AstalNetwork.get_default();

export function Network() {
    const [network_handler, set_network_handler] = createState(false);
    
    network.connect("notify", () => {
        set_network_handler(!network_handler());
    })

    return (
        <box>
            <With value={network_handler}>
                {(value) =>
                    <icon icon={network.wifi?.iconName} />
                }
            </With>
        </box>
    )
}
