const batteryService = await Service.import('battery');
const hyprlandService = await Service.import('hyprland');
const networkService = await Service.import('network');
const audioService = await Service.import('audio')
const mprisService = await Service.import('mpris');
const bluetoothService = await Service.import('bluetooth');

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
        hpack: 'end',
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
        self.class_name = 'media'
        self.children = [
            Widget.CircularProgress({
                class_name: 'media-progress',
                value: batteryService.bind('icon_name')['emitter']['percent']/100, 
                start_at: 0.75,
                child: Widget.Icon({
                    icon: batteryService.bind('icon_name'),
                    css: 'font-size: 12px;'
                }),
            }),

            Widget.Label({
                label: ' '+batteryService.bind('icon_name')['emitter']['percent']+'%',
                class_name: 'media-artist'
            })
        ]

        let tooltip = 'hehehe';

        if (batteryService.bind('icon_name')['emitter']['charged'] == true) tooltip = 'Charged ' + batteryService.bind('icon_name')['emitter']['percent'].toString() + '%'
        else if (batteryService.bind('icon_name')['emitter']['charging'] == true) tooltip = 'Charging ' + batteryService.bind('icon_name')['emitter']['percent'].toString() + '%'
        else tooltip = 'Percentage ' + batteryService.bind('icon_name')['emitter']['percent'].toString() + '%'

        self.tooltip_text = tooltip
    })
}

function volume() {
    return Widget.Box({
        children: [
            Widget.EventBox({
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
        ]
    })
}

function media() {
    return Widget.EventBox({
        onPrimaryClick: () => Utils.exec('playerctl play-pause'),

        child: Widget.Box().hook(mprisService, self => {
            const player = mprisService.bind('players')['emitter']['players'][0]
            let media_icon = 'media-playback-start-symbolic';
            let increase = 1/player['length'];

            if (player['play-back-status'] == 'Playing') media_icon = 'media-playback-pause-symbolic';
            else media_icon = 'media-playback-start-symbolic';

            if (player != undefined) {
                self.class_name = 'media';
                self.children = [
                    Widget.CircularProgress().hook(mprisService, self => {
                        setInterval(() => {
                            if (player['play-back-status'] == 'Playing') {
                                self.value = player['position'] / player['length'];
                            }
                        }, 1000);
                        
                        self.value = player['position'] / player['length'];
                        self.start_at = 0.75,
                        self.class_name = 'media-progress'
                    }),

                    Widget.Icon({
                        icon: media_icon,
                        css: 'margin-left: -20px; font-size: 8px;'
                    }),
    
                    Widget.Label({
                        class_name: 'media-title',
                        label: `${player['track-title'] == ''
                            ? `${player['track-artists'][0] == '' ? '' : ' Unknown title'}`
                            : ' ' + player['track-title']
                        }`,
                        truncate: 'end',
                        maxWidthChars: 20
                    }),
    
                    Widget.Label({
                        class_name: 'media-artist',
                        label: `${player['track-artists'][0] == ''
                            ? `${player['track-title'] == '' ? ' No media playing' : ' • Unknown artists'}`
                            : ' • ' + player['track-artists'][0]
                        }`,
                        truncate: 'end',
                        maxWidthChars: 15
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

const divide = ([total, free]) => free / total

const cpu_usage = Variable(0, {
    poll: [2000, 'top -b -n 1', out => divide([100, out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        .split(/\s+/)[1]
        .replace(',', '.')])],
})

const ram_usage = Variable(0, {
    poll: [2000, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        .split(/\s+/)
        .splice(1, 2))],
})

const swap_usage = Variable(0, {
    poll: [2000, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Swap:'))
        .split(/\s+/)
        .splice(1, 2))],
})

// SVG files and SVG editor: https://iconduck.com and https://deeditor.com

function usage() {
    return Widget.Box({
        class_name: 'chart',
        spacing: 5,
        children: [
            Widget.CircularProgress({
                class_name: 'media-progress',
                start_at: 0.75,
                value: cpu_usage.bind(),
                tooltip_text: 'CPU Usage',
                child: Widget.Icon({
                    icon: `${App.configDir}/assests/cpu.svg`,
                    css: 'font-size: 12px;'
                })
            }),

            Widget.CircularProgress({
                class_name: 'media-progress',
                start_at: 0.75,
                value: ram_usage.bind(),
                tooltip_text: 'RAM Usage',
                child: Widget.Icon({
                    icon: `${App.configDir}/assests/ram.svg`,
                    css: 'font-size: 12px;'
                })
            }), 

            Widget.CircularProgress({
                class_name: 'media-progress',
                start_at: 0.75,
                value: swap_usage.bind(),
                tooltip_text: 'Swap Usage',
                child: Widget.Icon({
                    icon: `${App.configDir}/assests/swap.svg`,
                    css: 'font-size: 12px;'
                })
            })
        ]
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

function Center_Left() {
    return Widget.Box({
        hpack: 'end',
        spacing: 5,
        children: [
            usage(),
            clock()
        ]
    })
}

function Center_Right() {
    return Widget.Box({
        spacing: 5,
        children: [
            media(),
            battery()
        ]
    })
}

function Center() {
    return Widget.Box({
        spacing: 5,
        class_name: 'modules-center',
        children: [
            usage(),
            clock(),
            workspaces(),
            media(),
            battery()
        ]
    })
}

function Right() {
    return Widget.Box({
        class_name: 'modules-right',
        hpack: 'end',
        children: [
            network(),
            volume()
        ],

        spacing: 8
    })
}

function top_bar() {
    return Widget.Window({
        name: 'top_bar',
        class_name: 'top-bar',
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

let utilities_mode = 'wifi';

function utilities() {
    return Widget.Box({
        vertical: 1,
        class_name: 'utilities',
        children: [
            Widget.Box({
                class_name: 'utilities-chooser',
                spacing: 5,
                hpack: 'center',
                children: [
                    Widget.Button({
                        onClicked: () => utilities_mode.setValue('bluetooth'),
                        child: Widget.Icon().hook(networkService.wifi, self => {
                            self.icon = networkService.wifi.bind('icon_name')['emitter']['icon-name']
                        })
                    }),

                    Widget.Button({
                        child: Widget.Icon().hook(bluetoothService, self => {
                            self.icon = 'bluetooth-symbolic'
                        })
                    }),

                    Widget.Button({
                        child: Widget.Icon({
                            icon: 'airplane-mode-symbolic'
                        })
                    }),

                    Widget.Button({
                        child: Widget.Icon({
                            icon: 'weather-clear-night-symbolic'
                        })
                    }),

                    Widget.Button({
                        child: Widget.Icon({
                            icon: 'system-shutdown-symbolic'
                        })
                    }),
                ]
            }),

            Widget.Box({
                class_name: 'utilities-slider',
                hpack: 'center',
                children: [
                    Widget.Slider().hook(audioService, self => {
                        self.class_name = 'audio-slider';
                        self.min = 0;
                        self.max = 100;
                        self.value = audioService.speaker.volume * 100;
                        self.onChange = ({value}) => audioService.speaker.volume = value/100;
                        self.css = 'font-size: 0px;'
                    })
                ]
            }),

            Widget.Box().hook(networkService, self => {
                self.vertical = 1;

                if (utilities_mode.getValue() == 'wifi') {
                    self.class_name = 'utilities-menu'
                    self.children = [
                        Widget.Box({
                            hpack: 'center',
                            spacing: 10,
                            children: [
                                Widget.Label({
                                    label: 'Wifi on/off'
                                }),

                                Widget.Switch({
                                    class_name: 'utilities-switch',
                                    on_activate: ({active}) => networkService.wifi.toggleWifi
                                }),
                            ]
                        }),

                        Widget.Box({
                            vertical: 1,
                            children: networkService.wifi['access-points'].map(hehe => {
                                return Widget.Button({
                                    class_name: 'utilities_button',
                                    child: Widget.Box({
                                        children: [
                                            Widget.Icon({
                                                icon: hehe['iconName']
                                            }),
                
                                            Widget.Label({
                                                label: ` ${hehe['ssid']}`
                                            })
                                        ]
                                    })
                                })
                            })
                        })
                    ]
                } else if (utilities_mode == 'bluetooth') {
                    self.class_name = 'utilities-menu'
                    self.children = [
                        Widget.Box({
                            hpack: 'center',
                            spacing: 10,
                            children: [
                                Widget.Label({
                                    label: 'Bluetooth on/off'
                                }),

                                Widget.Switch({
                                    class_name: 'utilities-switch',
                                    on_activate: ({active}) => networkService.wifi.toggleWifi
                                }),
                            ]
                        }),

                        Widget.Box({
                            vertical: 1,
                            children: networkService.wifi['access-points'].map(hehe => {
                                return Widget.Button({
                                    class_name: 'utilities_button',
                                    child: Widget.Box({
                                        children: [
                                            Widget.Icon({
                                                icon: hehe['iconName']
                                            }),
                
                                            Widget.Label({
                                                label: ` ${hehe['ssid']}`
                                            })
                                        ]
                                    })
                                })
                            })
                        })
                    ]
                }
            })
        ]
    })
}

function right_bar() {
    return Widget.Window({
        name: 'right_bar',
        class_name: 'right-bar',
        layer: 'top',
        exclusivity: 'exclusive',
        anchor: ['top', 'right'],
        margins: [10],
        child: Widget.Box({
            children: [
                utilities(),
            ]
        })
    })
}

App.config({
    windows: [
        // Calendar(),
        top_bar(),
        // right_bar()
    ],

    style: './style.css',
})

Utils.monitorFile(
    `${App.configDir}/../../.cache/wal/rgb-colors.css`,

    function() {
        App.resetCss()
        App.applyCss(`${App.configDir}/style.css`)
    },
)

export { };
