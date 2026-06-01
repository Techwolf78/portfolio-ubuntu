import displaySpotify from './components/apps/spotify';
import displayVsCode from './components/apps/vscode';
import { displayTerminal } from './components/apps/terminal';
import { displaySettings } from './components/apps/settings';
import { displayChrome } from './components/apps/chrome';
import { displayTrash } from './components/apps/trash';
import { displayGedit } from './components/apps/gedit';
import { displayAboutAjay } from './components/apps/ajay';
import { displayTerminalCalc } from './components/apps/calc';
import { displayNautilus } from './components/apps/nautilus';
import { displaySystemMonitor } from './components/apps/system_monitor';
import { displaySnake } from './components/apps/snake';
import { displayWeather } from './components/apps/weather';
import { displayGeditEditor } from './components/apps/gedit_editor';

const apps = [
    {
        id: "chrome",
        title: "Google Chrome",
        icon: './themes/Yaru/apps/chrome.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayChrome,
    },
    {
        id: "spotify",
        title: "Spotify",
        icon: './themes/Yaru/apps/spotify.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySpotify, // India Top 50 Playlist 😅
    },
    {
        id: "about-ajay",
        title: "About Ajay",
        icon: './themes/Yaru/system/user-home.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayAboutAjay,
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayVsCode,
    },
    {
        id: "terminal",
        title: "Terminal",
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminal,
    },
    {
        id: "calc",
        title: "Calc",
        icon: './themes/Yaru/apps/calc.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminalCalc,
    },
    {
        id: "settings",
        title: "Settings",
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySettings,
    },
    {
        id: "trash",
        title: "Trash",
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayTrash,
    },
    {
        id: "gedit",
        title: "Contact Me",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayGedit,
    },
    {
        id: "nautilus",
        title: "Files",
        icon: './themes/Yaru/system/folder.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayNautilus,
    },
    {
        id: "system-monitor",
        title: "System Monitor",
        icon: './themes/Yaru/status/experience.svg',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displaySystemMonitor,
    },
    {
        id: "snake",
        title: "Snake Game",
        icon: './themes/Yaru/status/skills.svg',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displaySnake,
    },
    {
        id: "weather",
        title: "Weather",
        icon: './themes/Yaru/status/projects.svg',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayWeather,
    },
    {
        id: "gedit_editor",
        title: "Text Editor",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayGeditEditor,
    },
    {
        id: "github",
        title: "GitHub",
        icon: './themes/Yaru/apps/github.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://github.com/Techwolf78",
        screen: () => {},
    },
    {
        id: "tars",
        title: "Ajay Portfolio",
        icon: './themes/Yaru/apps/tars.svg',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://ajay-pawar.vercel.app/"
    },
]

export default apps;