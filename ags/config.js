const batteryService = await Service.import('battery');
const hyprlandService = await Service.import('hyprland');
const networkService = await Service.import('network');
const audioService = await Service.import('audio')
const mprisService = await Service.import('mpris');

function workspaces() {
    function checkActiveWorkspace(a) {
        for (let i = 0; i < hyprlandService.bind('clients').emitter.clients.length; i++) {
            if (a == hyprlandService.bind('clients').emitter.clients[i].workspace.id) return true;
        }
    
        return false;
    }

    return Widget.EventBox({
        child: Widget.Box({
            class_name: 'workspaces',
            spacing: 5,

            children: Array.from({length: 10}, (_, i) => i+1).map(i => Widget.Button().hook(hyprlandService, self => {
                self.onClicked = () => hyprlandService.messageAsync(`dispatch workspace ${i}`);
                let clasename = 'empty';

                if (hyprlandService.active.workspace.bind('id')['emitter']['id'] == i) checkActiveWorkspace(i) ? clasename = 'focused_and_active' : clasename = 'focused';
                else checkActiveWorkspace(i) ? clasename = 'active' : clasename = 'empty';

                self.class_name = clasename
            }))
        }),

        onScrollDown: () => Utils.exec('hyprctl dispatch workspace +1'),
        onScrollUp: () => Utils.exec('hyprctl dispatch workspace -1'),
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
                label: hyprlandService.active.client.bind('title').as(p => p == '' ? `Workspace ${hyprlandService.active.workspace.id}` : p.replace(' — Mozilla Firefox', '')),
                class_name: 'window-title',
                maxWidthChars: 40,
                truncate: 'end',
                hpack: 'start'
            })
        ],

        vertical: true
    })
}

const time_time = Variable('', {
    poll: [1000, 'date +"%H:%M"']
})

const time_date = Variable('', {
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
            Widget.Icon().hook(networkService.wifi, self => {
                self.icon = networkService.wifi.bind('icon_name')['emitter']['icon-name']
            })
        ],

        tooltip_text: networkService.wifi.bind('ssid'),
    })
}

function battery() {
    return Widget.Box().hook(batteryService, self => {
        self.children = [
            Widget.Icon({
                icon: batteryService.bind('icon_name'),
            }),
        ]

        let tooltip = 'hehehe';

        if (batteryService.bind('icon_name')['emitter']['charged'] == true) tooltip = 'Charged ' + batteryService.bind('icon_name')['emitter']['percent'].toString() + '%'
        else if (batteryService.bind('icon_name')['emitter']['charging'] == true) tooltip = 'Charging ' + batteryService.bind('icon_name')['emitter']['percent'].toString() + '%'
        else tooltip = 'Percentage ' + batteryService.bind('icon_name')['emitter']['percent'].toString() + '%'

        self.tooltip_text = tooltip
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

        if (mut == true) self.icon = 'audio-volume-muted-symbolic'
        else if (vol <= 15) self.icon = 'audio-volume-low-symbolic'
        else if (vol <= 25) self.icon = 'audio-volume-medium-symbolic'
        else if (vol <= 67) self.icon = 'audio-volume-high-symbolic'
        else self.icon = 'audio-volume-overamplified-symbolic'

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

function media() {
    return Widget.EventBox({
        onPrimaryClick: () => Utils.exec('playerctl play-pause'),

        child: Widget.Box().hook(mprisService, self => {
            const player = mprisService.bind('players')['emitter']['players'][0]

            if (player != undefined) {
                self.class_name = 'media';
                self.children = [
                    Widget.CircularProgress().hook(mprisService, self => {
                        setInterval(() => {
                            if (player['play-back-status'] == 'Playing') {
                                self.value = player['position'] / player['length'];
                            }
                        }, 1000);
                        
                        self.start_at = 0.75,
                        self.class_name = 'media-progress'
                    }),
    
                    Widget.Label({
                        class_name: 'media-title',
                        label: ` ${player['track-title'] == '' ? '' : player['track-title']}`,
                        truncate: 'end',
                        maxWidthChars: 20
                    }),
    
                    Widget.Label({
                        class_name: 'media-artist',
                        label: `${player['track-artists'][0] == '' ? 'No media playing' : ' • ' + player['track-artists'][0]}`,
                        truncate: 'end',
                        maxWidthChars: 20
                    }),
                ]                
            } else {
                self.class_name = 'media';
                self.children = [
                    Widget.CircularProgress({
                        class_name: 'media-progress',
                    }),
    
                    Widget.Label({
                        class_name: 'media-artist',
                        label: ' No media playing',
                    }),
                ];
            }
        }, 'player-changed')
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
