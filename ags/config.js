const batteryService = await Service.import('battery');
const hyprlandService = await Service.import('hyprland');
const networkService = await Service.import('network');
const audioService = await Service.import('audio')
const mprisService = await Service.import('mpris');

function workspaces() {
    function checkActiveWorkspace(a) {
        for (let i = 0; i < hyprlandService.bind("clients").emitter.clients.length; i++) {
            if (a == hyprlandService.bind("clients").emitter.clients[i].workspace.id) {
                return true
            }
        }
    
        return false;
    }

    const activeId = hyprlandService.active.workspace.bind('id');

    return Widget.EventBox({
        child: Widget.Box({
            class_name: 'workspaces',
            spacing: 5,
            children: Array.from({length: 10}, (_, i) => i+1).map(i => Widget.Button({
                onClicked: () => hyprlandService.messageAsync(`dispatch workspace ${i}`),
                class_name: activeId.as(id => `${id == i
                    ? `${checkActiveWorkspace(i) ? "focused_and_active" : "focused"}`
                    : `${checkActiveWorkspace(i) ? "active" : "empty"}`}`)
            }))
        }),

        onScrollDown: () => Utils.exec("hyprctl dispatch workspace -1"),
        onScrollUp: () => Utils.exec("hyprctl dispatch workspace +1"),
    })
}

function window() {
    return Widget.Box({
        children: [
            Widget.Label({
                label: hyprlandService.active.client.bind('class').as(p => p == '' ? 'Desktop' : p),
                class_name: 'window-class',
                hpack: 'start'
            }),

            Widget.Label({
                label: hyprlandService.active.client.bind('title').as(p => p == '' ? `Workspace ${hyprlandService.active.workspace.id}` : p),
                class_name: 'window-title',
                maxWidthChars: 40,
                truncate: 'end',
                hpack: 'start'
            })
        ],

        vertical: true
    })
}

const time_time = Variable("", {
    poll: [1000, 'date +"%H:%M"']
})

const time_date = Variable("", {
    poll: [1000, 'date +"• %a, %b %d"']
})

function clock() {
    return Widget.Box({
        spacing: 4,
        children: [
            Widget.Label({
                label: time_time.bind(),
                class_name: 'time-time'
            }),

            Widget.Label({
                label: time_date.bind(),
                class_name: 'time-date'
            })
        ],

        class_name: 'clock'
    })
}

function network() {
    return Widget.Box({
        children: [
            Widget.Icon({
                icon: networkService.wifi.bind('icon_name')
            }),
        ],

        tooltip_text: networkService.wifi.bind('ssid'),
        spacing: 5,
    })
}

function battery() {
    return Widget.Box({
        children: [
            Widget.Icon({
                icon: batteryService.bind('icon_name'),
            }),
        ],

        // tooltip_text: `${batteryService.bind('percent')}`,
        spacing: 5
    })
}

const volumeIndicator = Widget.EventBox({
    class_name: 'volume',
    onPrimaryClick: () => audioService.speaker.is_muted = !audioService.speaker.is_muted,
    onScrollUp: () => audioService.speaker.volume += 0.01,
    onScrollDown: () => audioService.speaker.volume -= 0.01,
    child: Widget.Icon().hook(audioService.speaker, self => {
        let vol = audioService.speaker.volume * 100
        let mut = audioService.speaker.is_muted

        if (mut == true) {
            self.icon = "audio-volume-muted-symbolic"
        } else if (vol <= 15) {
            self.icon = "audio-volume-low-symbolic"
        } else if (vol <= 25) {
            self.icon = "audio-volume-medium-symbolic"
        } else if (vol <= 67) {
            self.icon = "audio-volume-high-symbolic"
        } else {
            self.icon = "audio-volume-overamplified-symbolic"
        }

        self.tooltip_text = `Volume ${Math.floor(vol)}%`;
    })
})

function volume() {
    return Widget.Box({
        children: [
            volumeIndicator,
        ]
    })
}

function mediabox(player) {
    return Widget.Box({
        class_name: "media",
        children: [
            Widget.CircularProgress().hook(player, hehe => {
                setInterval(() => {
                    if (player.play_back_status == "Playing") {
                        hehe.value = player.position / player.length;
                    }
                }, 1000);

                hehe.start_at = 0.75;
                hehe.class_name = "media-progress";
            }),

            Widget.Label().hook(player, hehe => {
                hehe.class_name = "media-title"
                hehe.label = ` ${player.track_title}`
                hehe.truncate = "end"
                hehe.max_width_chars = 20
            }),

            Widget.Label().hook(player, hehe => {
                hehe.class_name = "media-artist";
                hehe.label = ` • ${player.track_artists[0]} `;
                hehe.truncate = "end"
                hehe.max_width_chars = 20
            })
        ]
    })
}

// function mediabox() {
//     let progress = 0, title = "", artist = "", player = mprisService.bind("players")["emitter"]["players"][0]

//     setInterval(() => {
//         player = mprisService.bind("players")["emitter"]["players"][0]
//         console.log("[IMPORTATN]:", player)
//         progress = mprisService.bind("players")["emitter"]["players"][0].position / mprisService.bind("players")["emitter"]["players"][0].length;
//         title = mprisService.bind("players")["emitter"]["players"][0]["track-title"];
//         artist = mprisService.bind("players")["emitter"]["players"][0]["track-artist"];
//     }, 1000)
// }

function media() {
    return Widget.EventBox({
        onPrimaryClick: () => Utils.exec("playerctl play-pause"),
        child: Widget.Box({
            children: mprisService.bind("players").as(hehe => hehe.map(player => (
                mediabox(player)
            )))
        })
    })
}

function Left() {
    return Widget.Box({
        class_name: 'modules-left',
        children: [
            window()
        ],

        spacing: 15
    })
}

function Center() {
    return Widget.Box({
        class_name: 'modules-center',
        children: [
            clock(),
            workspaces(),
            media()
        ]
    })
}

function Right() {
    return Widget.Box({
        class_name: 'modules-right',
        hpack: 'end',
        children: [
            network(),
            battery(),
            volume()
        ],

        spacing: 8
    })
}

function Bar() {
    return Widget.Window({
        name: 'top_bar',
        class_name: 'Bar',
        layer: 'bottom',
        exclusivity: 'exclusive',
        anchor: ['top', 'left', 'right'],
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right()
        })
    })
}

const Calendar = () => Widget.Window({
    name: 'calendar',
    layer: 'bottom',
    anchor: ['top', 'right'],
    margins: [10, 10, 10, 10],
    child: Widget.Calendar({
        show_day_names: true,
        show_heading: true,
        show_week_numbers: true,
    })
})

App.config({
    windows: [
        // Calendar(),
        Bar(),
    ],

    style: './style.css'
})


export { };
