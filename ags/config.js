const batteryService = await Service.import('battery');
const hyprlandService = await Service.import('hyprland');
const networkService = await Service.import('network');
const audioService = await Service.import('audio')
const mprisService = await Service.import('mpris');
const bluetoothService = await Service.import('bluetooth');
const systrayService = await Service.import('systemtray');

// const wifipoll = Variable('', {
//     poll: [20000, 'nmcli device wifi']
// })

function workspaces() {
    // wifipoll.getValue()
    function checkActiveWorkspace(a) {
        for (let i = 0; i < hyprlandService.bind('clients').emitter.clients.length; i++) {
            if (a == hyprlandService.bind('clients').emitter.clients[i].workspace.id) return true;
        }
    
        return false;
    }

    return Widget.EventBox({
        class_name: 'workspaces-event-box',
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

                const wow = setInterval(() => {
                    if (networkService.wifi['internet'] == 'connected') {
                        self.icon = networkService.wifi.bind('icon_name')['emitter']['icon-name']
                        clearInterval(wow)
                    }
                }, 1000);

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
                onScrollUp: () => audioService.speaker.volume += 0.03,
                onScrollDown: () => audioService.speaker.volume -= 0.03,
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

function bluetooth() {
    return Widget.Box().hook(bluetoothService, self => {
        let icon = 'bluetooth-disabled-symbolic'
        if (bluetoothService.bind('connected-devices')['emitter']['connected-devices'].length > 0) icon = 'bluetooth-active-symbolic'
        else icon = 'bluetooth-disabled-symbolic'

        let tooltip = '';
        for (let i=0; i<bluetoothService.bind('connected-devices')['emitter']['connected-devices'].length; i++) {
            tooltip += bluetoothService.bind('connected-devices')['emitter']['connected-devices'][i]['alias'];
            if (i<bluetoothService.bind('connected-devices')['emitter']['connected-devices'].length-1) tooltip += ' ';
        }

        self.children = [
            Widget.Icon({
                icon: icon
            })
        ]

        self.tooltip_text = tooltip
    })
}

let media_appear = false
let osv_appear = false
let media_position = -1;
let media_length = mprisService.bind('players')['emitter']['players'][0]['length'];

function media() {
    return Widget.EventBox({
        class_name: 'media-event-box',
        onPrimaryClick: () => {
            if (media_appear) {
                App.applyCss(`
                    .media-window {
                        margin-top: -175px;
                    }

                    .media-event-box .media {
                        background-color: @primaryContainer;
                        color: @onPrimaryContainer;
                    }

                    .media-event-box .media-progress {
                        background-color: alpha(@onPrimaryContainer, .16);
                    }
                `)

                if (osv_appear) {
                    App.applyCss(`
                        .on-screen-volume {
                            margin-top: 0px;
                        }    
                    `)
                }
            } else {
                App.applyCss(`
                    .media-window {
                        margin-top: 0px;
                    }

                    .media-event-box .media {
                        background-color: @onPrimaryContainer;
                        color: @primaryContainer;
                    }

                    .media-event-box .media-progress {
                        background-color: alpha(@primaryContainer, .2);
                    }
                `)

                if (osv_appear) {
                    App.applyCss(`
                        .on-screen-volume {
                            margin-top: 150px;
                        }    
                    `)
                }
            }

            media_appear = !media_appear
        },

        child: Widget.Box().hook(mprisService, self => {
            const player = mprisService.bind('players')['emitter']['players'][0]
            let media_icon = 'media-playback-start-symbolic';
            if (player['play-back-status'] == 'Playing') media_icon = 'media-playback-pause-symbolic';
            else media_icon = 'media-playback-start-symbolic';

            self.class_name = 'media';
            self.children = [
                Widget.CircularProgress({
                    class_name: 'media-progress',
                    start_at: 0.75,
                    setup: self => {
                        function callback() {
                            let player = mprisService.bind('players')['emitter']['players'][0]
                            self.value = media_position / media_length
                        }

                        self.hook(mprisService, callback, 'player-changed')
                        self.poll(1000, callback)
                    }
                }),

                Widget.Icon({
                    icon: media_icon,
                    css: 'margin-left: -20px; font-size: 8px; transition: none;'
                }),

                Widget.Label({
                    class_name: 'media-title',
                    label: player['track-title'],
                    truncate: 'end',
                    maxWidthChars: 20
                }),

                Widget.Label({
                    class_name: 'media-artist',
                    label: ` • ${player['track-artists'][0]}`,
                    truncate: 'end',
                    maxWidthChars: 15
                }),
            ]
        })
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
                    // icon: `${App.configDir}/assests/cpu.svg`,
                    icon: 'media-record',
                    css: 'font-size: 8px;'
                })
            }),

            Widget.CircularProgress({
                class_name: 'media-progress',
                start_at: 0.75,
                value: ram_usage.bind(),
                tooltip_text: 'RAM Usage',
                child: Widget.Icon({
                    // icon: `${App.configDir}/assests/ram.svg`,
                    icon: 'media-record',
                    css: 'font-size: 8px;'
                })
            }), 

            Widget.CircularProgress({
                class_name: 'media-progress',
                start_at: 0.75,
                value: swap_usage.bind(),
                tooltip_text: 'Swap Usage',
                child: Widget.Icon({
                    // icon: 'network-transmit-receive-symbolic',
                    icon: 'media-record',
                    css: 'font-size: 8px;'
                })
            })
        ]
    })
}

function tools() {
    return Widget.Box({
        spacing: 5,
        class_name: 'chart',
        css: 'margin: 6px 4px 6px 4px;',
        children: [
            Widget.EventBox({
                onPrimaryClick: () => Utils.execAsync('hyprpicker -a'),
                class_name: 'utilities_button',
                child: Widget.Icon({
                    class_name: 'tools-icon',
                    icon: 'document-edit-symbolic',
                })
            }),

            Widget.EventBox({
                onPrimaryClick: () => Utils.execAsync("notify-send '(> ω <)'"),
                class_name: 'utilities_button',
                child: Widget.Icon({
                    class_name: 'tools-icon',
                    icon: 'find-location-symbolic',
                })
            })
        ]
    })
}


/** @param {import('types/service/systemtray').TrayItem} item */
const SysTrayItem = item => Widget.Button({
    css: 'padding: 0; font-size: 18px;',
    class_name: 'utilities_button',
    child: Widget.Icon().bind('icon', item, 'icon'),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
});

const sysTray = Widget.Box({
    children: systrayService.bind('items').as(i => i.map(SysTrayItem)),
    spacing: 5,
    setup: self => {
        function update() {
            if (systrayService.bind('items')['emitter']['items'].length > 0) self.class_name = 'chart'
            else self.class_name = ''
        }

        self.hook(systrayService, update, 'changed')
    }
})

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
            usage(),
            clock(),
            workspaces(),
            media(),
            battery(),
            tools()
        ]
    })
}

function Right() {
    return Widget.Box({
        class_name: 'modules-right',
        hpack: 'end',
        children: [
            sysTray,
            network(),
            bluetooth(),
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

// let utilities_mode = 'wifi';
const utilities_mode = Variable('wifi')

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
                        onClicked: () => utilities_mode.setValue('wifi'),
                        child: Widget.Icon().hook(networkService.wifi, self => {
                            self.icon = networkService.wifi.bind('icon_name')['emitter']['icon-name']
                        })
                    }),

                    Widget.Button({
                        onClicked: () => utilities_mode.setValue('bluetooth'),
                        child: Widget.Icon().hook(bluetoothService, self => {
                            let icon = 'bluetooth-disabled-symbolic'
                            if (bluetoothService.bind('connected-devices')['emitter']['connected-devices'].length > 0) icon = 'bluetooth-active-symbolic'
                            else icon = 'bluetooth-disabled-symbolic'

                            self.icon = icon
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
                vertical: 1,
                class_name: 'utilities-slider',
                hpack: 'center',
                children: [
                    Widget.Box({
                        children: [
                            Widget.Icon().hook(audioService.speaker, self => {
                                let vol = audioService.speaker.volume * 100
                                let mut = audioService.speaker.is_muted
                        
                                if (mut == true) self.icon = 'audio-volume-muted-symbolic'
                                else if (vol <= 15) self.icon = 'audio-volume-low-symbolic'
                                else if (vol <= 25) self.icon = 'audio-volume-medium-symbolic'
                                else if (vol <= 67) self.icon = 'audio-volume-high-symbolic'
                                else self.icon = 'audio-volume-overamplified-symbolic'
                        
                                self.tooltip_text = `Volume ${Math.floor(vol)}%`;
                            }),

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
                    Widget.Box({
                        children: [
                            Widget.Icon().hook(audioService.speaker, self => {
                                let vol = audioService.speaker.volume * 100
                                let mut = audioService.speaker.is_muted
                        
                                if (mut == true) self.icon = 'audio-volume-muted-symbolic'
                                else if (vol <= 15) self.icon = 'audio-volume-low-symbolic'
                                else if (vol <= 25) self.icon = 'audio-volume-medium-symbolic'
                                else if (vol <= 67) self.icon = 'audio-volume-high-symbolic'
                                else self.icon = 'audio-volume-overamplified-symbolic'
                        
                                self.tooltip_text = `Volume ${Math.floor(vol)}%`;
                            }),
                            
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
                ]
            }),

            Widget.Box({
                vertical: 1,
                children: [

                    // WIFI

                    Widget.Box().hook(networkService, self=> {
                        self.class_name = 'utilities-menu'
                        self.vertical = 1

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
                    }),

                    // BLUETOOTH

                    Widget.Box().hook(bluetoothService, self => {
                        self.class_name = 'utilities-menu'
                        self.vertical = 1

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
                                        // on_activate: ({active}) => networkService.wifi.toggleWifi
                                    }),
                                ]
                            }),
    
                            Widget.Box({
                                vertical: 1,
                                children: bluetoothService.bind('connected-devices')['emitter']['devices'].map(hehe => {
                                    let icon = 'bluetooth-disabled-symbolic'
                                    if (hehe.connected == true) icon = 'bluetooth-active-symbolic'
                                    else icon = 'bluetooth-disabled-symbolic'

                                    return Widget.Button({
                                        class_name: 'utilities_button',
                                        child: Widget.Box({
                                            children: [
                                                Widget.Icon({
                                                    icon: icon
                                                }),
                    
                                                Widget.Label({
                                                    label: ` ${hehe['alias']}`
                                                })
                                            ]
                                        })
                                    })
                                })
                            })
                        ]
                    })
                ]
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

function intToTime(a) {
    if (a==-1 || isNaN(a)) return '00:00'
    let h = Math.floor(a/3600);
    let m = Math.floor((a-h*3600)/60);
    let s = Math.floor(a-h*3600-m*60);
    let hh = '';
    let mm = '';
    let ss = '';
    if (h<10) hh = '0';
    if (m<10) mm = '0';
    if (s<10) ss = '0';
    if (h==0) return mm + m.toString() + ':' + ss + s.toString();
    else return hh + h.toString() + ':' + mm + m.toString() + ':' + ss+s.toString();
}

function split_title(a) {
    let s = '', count=0, wordlen=0;
    for (let i=0; i<a.length; i++) {
        count++;
        s+=a[i];
        wordlen++;
        
        if (i>75) {
            s+='...';
            return s;
        } if (wordlen>=40) {
            s+='-\n';
            wordlen=0;
        } if (a[i]==' ') {
            wordlen = 0;

            if (count>=40) {
                s+='\n';
                count=0;
            }
        }
    }

    return s;
}

function media_window() {
    return Widget.Window({
        name: 'media_window',
        class_name: 'media-window',
        layer: 'top',
        anchor: ['top'],
        margins: [10],

        child: Widget.Box({
            vertical: 1,
            children: [
                Widget.Label({
                    label: 'This window could not appear without this label, i don\'t know how to fix this bug :)',
                    css: 'font-size: 1px; margin-top: -2px;'
                }),

                Widget.Box({
                    spacing: 10,
                    class_name: 'media-window',
                    children: [
                        Widget.Box().hook(mprisService, self => {
                            self.css = `background-image: url('${mprisService.bind('players')['emitter']['players'][0]['track-cover-url'].replace('file://', '')}'); min-width: 120px; min-height: 120px; background-size: auto 100%; background-repeat: no-repeat; background-clip: content-box; background-position: 50% 50%; border-radius: 12px; box-shadow: 0px 0px 4px rgba(0, 0, 0, .4);`
                        }),

                        Widget.Box({
                            vertical: 1,
                            vpack: 'center',
                            spacing: 20,
                            children: [
                                Widget.Box({
                                    css: 'margin-left: 10px;',
                                    vertical: 1,
                                    children: [
                                        Widget.Label().hook(mprisService, self => {
                                            self.hpack = 'start',
                                            self.css = 'font-weight: 800;'
                                            self.label = split_title(mprisService.bind('players')['emitter']['players'][0]['track-title'])
                                        }),

                                        Widget.Label().hook(mprisService, self => {
                                            self.hpack = 'start'
                                            self.label = mprisService.bind('players')['emitter']['players'][0]['track-artists'][0]
                                        })
                                    ]
                                }),

                                Widget.Box({
                                    vertical: 1,
                                    css: 'min-width: 300px;',
                                    spacing: 10,
                                    children: [
                                        Widget.Slider({
                                            min: 0,
                                            max: 100,
                                            class_name: 'media-slider',

                                            setup: self => {
                                                let a = -1;
                                                function callback() {
                                                    a = self.value;

                                                    let player = mprisService.bind('players')['emitter']['players'][0]
                                                    if (player['play-back-status'] == 'Playing') media_position = player['position']
                                                    else if (player['play-back-status'] == null) media_position = 0
                                                    self.onChange = ({value}) => player['position'] = value/100 * media_length
                                                    self.value = media_position / media_length * 100

                                                    media_length = Math.round(Number(Utils.exec('playerctl metadata mpris:length')/1000000))
                                                }

                                                self.hook(mprisService, callback, 'player-changed')
                                                self.poll(1000, callback)
                                            }
                                        }),

                                        Widget.CenterBox({
                                            spacing: 10,
                                            start_widget: Widget.Label({
                                                hpack: 'end',
                                                setup: self => self.poll(1000, () => {self.label = intToTime(media_position)})
                                            }),
    
                                            center_widget: Widget.Box({
                                                spacing: 5,
                                                children: [        
                                                    Widget.Button({
                                                        onClicked: () => mprisService.bind('players')['emitter']['players'][0].previous(),
                                                        child: Widget.Icon({
                                                            icon: 'media-skip-backward-symbolic'
                                                        })
                                                    }),
        
                                                    Widget.Button({
                                                        onClicked: () => mprisService.bind('players')['emitter']['players'][0].playPause(),
                                                        child: Widget.Icon().hook(mprisService, self => {
                                                            if (mprisService.bind('players')['emitter']['players'][0]['play-back-status'] == 'Playing') self.icon = 'media-playback-pause-symbolic'
                                                            else self.icon = 'media-playback-start-symbolic'
                                                        })
                                                    }),
        
                                                    Widget.Button({
                                                        onClicked: () => mprisService.bind('players')['emitter']['players'][0].next(),
                                                        child: Widget.Icon({
                                                            icon: 'media-skip-forward-symbolic'
                                                        })
                                                    }),
                                                ]
                                            }),

                                            end_widget: Widget.Label({
                                                hpack: 'start',
                                                setup: self => self.poll(1000, () => {self.label = intToTime(media_length)})
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    })
}

var timeOuts = []

function onScreenVolume() {
    return Widget.Window({
        name: 'on_screen_volume',
        class_name: 'on-screen-volume',
        layer: 'top',
        anchor: ['top'],
        margins: [10],

        child: Widget.Box({
            vertical: 1,
            spacing: 3,
            children: [
                Widget.Box({
                    class_name: 'on-screen-volume',
                    spacing: 5,
                    vertical: 1,
                    children: [
                        Widget.CenterBox({
                            start_widget: Widget.Box({
                                spacing: 5,
                                children: [
                                    Widget.Label({
                                        label: 'Speaker volume'
                                    })
                                ]
                            }),

                            end_widget: Widget.Label().hook(audioService.speaker, self => {
                                self.hpack ='end'
                                self.class_name = 'osv-label'
                                self.label = `${Math.floor(audioService.speaker.volume * 100)}%`
                            })
                        }),

                        Widget.Box({
                            children: [
                                Widget.LevelBar().hook(audioService.speaker, self => {
                                    for (var i=0; i<timeOuts.length; i++) clearTimeout(timeOuts[i])
                                    osv_appear = true
                
                                    if (media_appear) {
                                        App.applyCss(`
                                            .on-screen-volume {
                                                margin-top: 150px;
                                            }
                                        `)
                                    } else {
                                        App.applyCss(`
                                            .on-screen-volume {
                                                margin-top: 0px;
                                            }
                                        `)
                                    }
                
                                    timeOuts.push(
                                        setTimeout(() => {
                                            osv_appear = false
                                            App.applyCss(`
                                                .on-screen-volume {
                                                    margin-top: -70px;
                                                }
                                            `)
                                        }, 2000)
                                    )
                
                                    self.class_name = 'osv-bar'
                                    self.widthRequest = 175
                                    self.value = audioService.speaker.volume
                                }),
                            ]
                        })
                    ]
                }),

                Widget.Label({
                    label: 'This window could not disappear without this label, i don\'t know how to fix this bug :)',
                    css: 'font-size: 1px; margin-top: -10px; color: transparent;'
                }),
            ]
        })
    })
}

App.config({
    windows: [
        // Calendar(),
        top_bar(),
        onScreenVolume(),
        media_window(),
        // right_bar(),
    ],

    style: './style.css',
})

Utils.monitorFile(
    `${App.configDir}/../../Downloads/wallpapers/ags`,

    function() {
        App.resetCss()
        App.applyCss(`${App.configDir}/style.css`)
    },
)

export { };
