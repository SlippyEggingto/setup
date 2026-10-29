-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- HYPRLAND LUA CONFIG (MIGRATED FROM 0.56 .CONF)        --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

require("./type5")

------------------
---- MONITORS ----
------------------

hl.monitor({
    output   = "",
    mode     = "preferred",
    position = "auto",
    scale    = "auto",
    transform = 0,
})

hl.monitor({
    output   = "DP-1",
    mode     = "1920x1080",
    position = "0x0",
    scale    = 1,
    mirror   = "eDP-1",
})

hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080",
    position = "0x0",
    scale    = 1,
    mirror   = "eDP-1",
})


---------------------
---- MY PROGRAMS ----
---------------------

local terminal    = "foot"
local fileManager = "nautilus"
local menu        = "wofi --show drun"


-------------------
---- AUTOSTART ----
-------------------

hl.on("hyprland.start", function () 
    hl.exec_cmd("playerctld daemon")
    hl.exec_cmd("wl-paste --type text --watch cliphist store")
    hl.exec_cmd("wl-paste --type image --watch cliphist store")
    hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
    hl.exec_cmd("awww-daemon")
    hl.exec_cmd("ags run >> .log/ags/log.txt 2>&1")
    hl.exec_cmd("fcitx5")
    hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
    hl.exec_cmd("systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
    hl.exec_cmd("/usr/lib/xdg-desktop-portal-hyprland &")
    hl.exec_cmd("alsactl --file ~/.config/asound.state restore")
end)


-------------------------------
---- ENVIRONMENT VARIABLES ----
-------------------------------

hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("XDG_CURRENT_DESKTOP", "Hyprland")
hl.env("XDG_SESSION_DESKTOP", "Hyprland")


-----------------------
---- LOOK AND FEEL ----
-----------------------

hl.config({
    general = {
        gaps_in     = 5,
        gaps_out    = 10,
        border_size = 1,
        
        col = {
            active_border = onPrimaryContainer,
        },
        layout = "dwindle",
    },

    decoration = {
        rounding         = 26,
        active_opacity   = 1.0,
        inactive_opacity = 1.0,

        blur = {
            enabled  = true,
            size     = 3,
            passes   = 1,
            vibrancy = 0.1696,
        },
    },

    animations = {
        enabled = true,
    },
})

hl.curve("myBezier",    { type = "bezier", points = { {0.05, 0.9},  {0.1, 1.05} } })
hl.curve("otherBezier", { type = "bezier", points = { {0.22, 0.68}, {0, 1}     } })

hl.animation({ leaf = "windows",     enabled = true, speed = 7,  bezier = "myBezier" })
hl.animation({ leaf = "windowsOut",  enabled = true, speed = 7,  style = "popin 80%", bezier = "default"})
hl.animation({ leaf = "border",      enabled = true, speed = 10, bezier = "default"})
hl.animation({ leaf = "borderangle", enabled = true, speed = 8,  bezier = "default" })
hl.animation({ leaf = "fade",        enabled = true, speed = 7,  bezier = "default" })
hl.animation({ leaf = "workspaces",  enabled = true, speed = 5,  bezier = "otherBezier" })


----------------
----  MISC  ----
----------------

hl.config({
    misc = {
        force_default_wallpaper = 0,
        disable_hyprland_logo   = true,
    },
})


---------------
---- INPUT ----
---------------

hl.config({
    input = {
        touchpad = {
            natural_scroll = true,
        },
    },
})


---------------------
---- KEYBINDINGS ----
---------------------

local mainMod = "SUPER"

hl.bind(mainMod .. " + Q",         hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + W",         hl.dsp.window.close())
hl.bind(mainMod .. " + M",         hl.dsp.exec_cmd("bash -c \"kill -2 Hyprland\""))
hl.bind(mainMod .. " + E",         hl.dsp.exec_cmd(fileManager))
hl.bind(mainMod .. " + SHIFT + E", hl.dsp.exec_cmd("nautilus admin:///"))
hl.bind(mainMod .. " + R",         hl.dsp.exec_cmd("togglefloating"))
hl.bind(mainMod .. " + D",         hl.dsp.exec_cmd("google-chrome-stable --profile-directory=\"Default\""))
hl.bind(mainMod .. " + SHIFT + D", hl.dsp.exec_cmd("google-chrome-stable --profile-directory=\"Profile 1\""))
hl.bind(mainMod .. " + SHIFT + P", hl.dsp.exec_cmd("google-chrome-stable --incognito --profile-directory=\"Default\""))
hl.bind(mainMod .. " + C",         hl.dsp.exec_cmd("code"))
hl.bind(mainMod .. " + Space",     hl.dsp.exec_cmd(menu))
hl.bind(mainMod .. " + Delete",    hl.dsp.exec_cmd("ags -r \"App.openWindow('logout_window')\""))
hl.bind(mainMod .. " + X",         hl.dsp.exec_cmd("gnome-text-editor"))
hl.bind(mainMod .. " + V",         hl.dsp.exec_cmd("cliphist list | wofi --dmenu | cliphist decode | wl-copy"))
hl.bind("Ctrl + Alt + A",          hl.dsp.exec_cmd("hyprshot -m region clipboard-only -z"))
hl.bind(mainMod .. " + A",         hl.dsp.exec_cmd("makoctl dismiss -a"))
hl.bind(mainMod .. " + SHIFT + A", hl.dsp.exec_cmd("makoctl restore"))
hl.bind(mainMod .. " + F",         hl.dsp.exec_cmd("fullscreen"))
hl.bind(mainMod .. " + T",         hl.dsp.exec_cmd("sh ~/wallpaper.sh"))

hl.bind("XF86AudioRaiseVolume",       hl.dsp.exec_cmd("pamixer --increase 1"), { repeating = true })
hl.bind("XF86AudioLowerVolume",       hl.dsp.exec_cmd("pamixer --decrease 1"), { repeating = true })
hl.bind(mainMod .. " + equal",        hl.dsp.exec_cmd("pamixer --increase 3"), { repeating = true })
hl.bind(mainMod .. " + SHIFT + equal", hl.dsp.exec_cmd("pamixer --increase 1"), { repeating = true })
hl.bind(mainMod .. " + minus",        hl.dsp.exec_cmd("pamixer --decrease 3"), { repeating = true })
hl.bind(mainMod .. " + SHIFT + minus", hl.dsp.exec_cmd("pamixer --decrease 1"), { repeating = true })
hl.bind("XF86AudioMute",              hl.dsp.exec_cmd("pamixer --toggle-mute"))
hl.bind(mainMod .. " + backspace",    hl.dsp.exec_cmd("pamixer --toggle-mute"))
hl.bind(mainMod .. " + SHIFT + backspace", hl.dsp.exec_cmd("alsactl --file ~/.config/asound.state restore && notify-send \"adjusted\" -t 1000"))

hl.bind("XF86MonBrightnessDown",            hl.dsp.exec_cmd("brightnessctl set 5%-"), { repeating = true })
hl.bind("XF86MonBrightnessUp",              hl.dsp.exec_cmd("brightnessctl set 5%+" ), { repeating = true })
hl.bind(mainMod .. " + SHIFT + F3",         hl.dsp.exec_cmd("brightnessctl set 5%+" ), { repeating = true })
hl.bind(mainMod .. " + SHIFT + F2",         hl.dsp.exec_cmd("brightnessctl set 5%-"), { repeating = true })
hl.bind(mainMod .. " + XF86MonBrightnessUp", hl.dsp.exec_cmd("brightnessctl set 100%"), { repeating = true })
hl.bind(mainMod .. " + XF86MonBrightnessDown", hl.dsp.exec_cmd("brightnessctl set 2%"),  { repeating = true })
hl.bind(mainMod .. " + F3",                 hl.dsp.exec_cmd("brightnessctl set 100%"))
hl.bind(mainMod .. " + F2",                 hl.dsp.exec_cmd("brightnessctl set 2%"))

hl.bind("XF86AudioPlay",       hl.dsp.exec_cmd("playerctl play-pause"))
hl.bind("XF86AudioNext",       hl.dsp.exec_cmd("playerctl next"))
hl.bind("XF86AudioPrev",       hl.dsp.exec_cmd("playerctl previous"))
hl.bind(mainMod .. " + J",     hl.dsp.exec_cmd("playerctl position 5-"), { repeating = true })
hl.bind(mainMod .. " + K",     hl.dsp.exec_cmd("playerctl play-pause"))
hl.bind(mainMod .. " + L",     hl.dsp.exec_cmd("playerctl position 5+"), { repeating = true })
hl.bind(mainMod .. " + N",     hl.dsp.exec_cmd("playerctl next"))
hl.bind(mainMod .. " + SHIFT + N", hl.dsp.exec_cmd("playerctl previous"))

hl.bind(mainMod .. " + left",  hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + right", hl.dsp.focus({ direction = "right" }))
hl.bind(mainMod .. " + up",    hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + down",  hl.dsp.focus({ direction = "down" }))

for i = 1, 10 do
    local key = i % 10
    hl.bind(mainMod .. " + " .. key,         hl.dsp.focus({ workspace = i }))
    hl.bind(mainMod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i, follow = false }))
end

hl.bind(mainMod .. " + S",         hl.dsp.workspace.toggle_special("magic"))
hl.bind(mainMod .. " + SHIFT + S", hl.dsp.window.move({ workspace = "special:magic", follow = false }))

hl.bind(mainMod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mainMod .. " + mouse_up",   hl.dsp.focus({ workspace = "e-1" }))

hl.bind(mainMod .. " + mouse:275",         hl.dsp.focus({ workspace = 11 }))
hl.bind(mainMod .. " + mouse:276",         hl.dsp.focus({ workspace = 12 }))
hl.bind(mainMod .. " + SHIFT + mouse:275", hl.dsp.window.move({ workspace = 11, follow = false }))
hl.bind(mainMod .. " + SHIFT + mouse:276", hl.dsp.window.move({ workspace = 12, follow = false }))

hl.bind(mainMod .. " + mouse:272", hl.dsp.window.drag(),   { mouse = true })
hl.bind(mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })


--------------------------------
---- WINDOWS AND WORKSPACES ----
--------------------------------

hl.window_rule({
    name  = "open-file-dialog-float",
    match = { title = "^(Open)(.*)$" },
    float = true,
    size  = "900 600",
})

hl.window_rule({
    name    = "no-blur-empty",
    match   = { class = "^$", title = "^$" },
    no_blur = true,
})

local noBlurLayers = {"eww-bar", "waybar", "logout_window", "wofi"}
for _, layer in ipairs(noBlurLayers) do
   hl.layer_rule({
       name    = "noblur-" .. layer,
       match   = { namespace = layer },
       blur = false,
   })
end

local noAnimLayers = {"media_window", "on_screen_volume", "on_screen_brightness", "gtk-layer-shell"}
for _, layer in ipairs(noAnimLayers) do
    hl.layer_rule({
        name    = "noanim-" .. layer,
        match   = { namespace = layer },
        no_anim = true,
    })
end