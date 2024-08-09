const batteryService = await Service.import('battery');
const hyprlandService = await Service.import('hyprland');
const networkService = await Service.import('network');

// const dispatch = ws => hyprlandService.messageAsync(`dispatch workspace ${ws}`);

// const workspaces = () => Widget.EventBox({
//     onScrollUp: () => dispatch('-1'),
//     onScrollDown: () => dispatch('+1'),
//     child: Widget.Box({
//         children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
//             attribute: i,
//             label: `${i}`,
//             onClicked: () => dispatch(i),
//         })),
//     }),
// })

const workspaces = () => Widget.EventBox({
    onScrollUp: () => hyprlandService.messageAsync('dispatch workspace -1'),
    onScrollDown: () => hyprlandService.messageAsync('dispatch workspace +1'),
    child: Widget.Box({
        children: Array.from({length: 10}, (_, i) => i+1).map(i => Widget.Button({
            attribute: i,
            label: `${i}`,
            onClicked: () => hyprlandService.messageAsync(`dispatch workspace ${i}`),
        }))
    }),
    
    class_name: 'workspaces'
})

function window() {
    return Widget.Box({
        children: [
            Widget.Label({
                label: hyprlandService.active.client.bind('class'),
                class_name: 'window-top',
                hpack: 'start'
            }),

            Widget.Label({
                label: hyprlandService.active.client.bind('title'),
                class_name: 'window-bottom',
                maxWidthChars: 40,
                truncate: 'end'
            })
        ],

        vertical: true
    })
}

const date_hm = Variable("", {
    poll: [1000, 'date +"%H:%M"']
})

const date_dmy = Variable("", {
    poll: [1000, 'date +"%a, %b %d"']
})

function clock() {
    return Widget.Box({
        children: [
            Widget.Label({
                label: date_hm.bind(),
                hpack: 'end',
                class_name: 'date_hm'
            }),

            Widget.Label({
                label: date_dmy.bind(),
                class_name: 'date_dmy'
            })
        ],

        vertical: true,
        class_name: 'clock'
    })
}

function top_bar_left() {
    return Widget.Box({
        class_name: 'modules-left',
        children: [
            window()
        ],

        spacing: 15
    })
}

function top_bar_center() {
    return Widget.Box({
        class_name: 'modules-center',
        children: [
            workspaces()
        ]
    })
}

function network() {
    return Widget.Box({
        children: [
            Widget.Icon({
                icon: networkService.wifi.bind('icon_name')
            }),

            Widget.Label({
                label: String(networkService.wifi.strength) + "%"
            })
        ],

        spacing: 5,
    })
}

function battery() {
    return Widget.Box({
        children: [
            Widget.Icon({
                icon: batteryService.bind('icon_name'),
            }),

            Widget.Label({
                label: String(batteryService.percent) + "%"
            })
        ],

        spacing: 5
    })
}

function top_bar_right() {
    return Widget.Box({
        class_name: 'modules-right',
        hpack: 'end',
        children: [
            network(),
            battery(),
            clock()
        ],

        spacing: 10
    })
}

function top_bar() {
    return Widget.Window({
        name: 'top_bar',
        layer: 'bottom',
        exclusivity: 'ignore',
        anchor: ['top', 'left', 'right'],
        child: Widget.CenterBox({
            start_widget: top_bar_left(),
            center_widget: top_bar_center(),
            end_widget: top_bar_right()
        })
    })
}

const calendar = () => Widget.Window({
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
        calendar(),
        top_bar()
    ],

    style: './style.css'
})


export { };
// export { };
