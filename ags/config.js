const batteryService = await Service.import('battery');
const hyprlandService = await Service.import('hyprland');
const networkService = await Service.import('network');

function workspaces() {
    function checkActiveWorkspace(a) {
        for (let i = 0; i < hyprlandService.workspaces.length; i++) {
            if (a === hyprlandService.workspaces[i].id) {
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
                // label: `${i}`,
                onClicked: () => hyprlandService.messageAsync(`dispatch workspace ${i}`),
                class_name: activeId.as(id => `${id == i ? 'focused' : `${checkActiveWorkspace(i) === true ? 'active' : ''}`}`)
            }))
        }),

        onScrollDown: () => Utils.exec("hyprctl dispatch workspace +1"),
        onScrollUp: () => Utils.exec("hyprctl dispatch workspace -1"),
    })
}

function window() {
    return Widget.Box({
        children: [
            Widget.Label({
                label: hyprlandService.active.client.bind('class').as(p => p == '' ? 'Desktop' : p),
                class_name: 'window-top',
                hpack: 'start'
            }),

            Widget.Label({
                label: hyprlandService.active.client.bind('title').as(p => p == '' ? `Workspace ${hyprlandService.active.workspace.id}` : p),
                class_name: 'window-bottom',
                maxWidthChars: 40,
                truncate: 'end',
                hpack: 'start'
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

const divide = ([total, free]) => free / total

const cpu = Variable(0, {
    // @ts-ignore
    poll: [2000, 'top -b -n 1', out => divide([100, out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        .split(/\s+/)[1]
        .replace(',', '.')])],
})

const ram = Variable(0, {
    // @ts-ignore
    poll: [2000, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        .split(/\s+/)
        .splice(1, 2))],
})

const cpuProgress = Widget.CircularProgress({
    class_name: 'cpu',
    value: cpu.bind(),
    start_at: 0.75
})

const ramProgress = Widget.CircularProgress({
    class_name: 'ram',
    value: ram.bind(),
    start_at: 0.75
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
            clock(),
            cpuProgress,
            ramProgress
        ],

        spacing: 10
    })
}

function top_bar() {
    return Widget.Window({
        name: 'top_bar',
        layer: 'bottom',
        exclusivity: 'exclusive',
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