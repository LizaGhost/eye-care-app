## 👁️ Eye Care App

A Windows 10 desktop application built with Electron that reminds you to take eye care breaks and guides you through 5-minute eye exercises every hour.

### Features

✨ **Automatic Reminders** - Get notified every 60 minutes (configurable) to take an eye care break
🏋️ **Guided Exercises** - 7 scientifically-backed eye exercises, each properly timed
⏱️ **5-Minute Workouts** - Complete workouts in exactly 300 seconds with real-time progress tracking
🖥️ **Always on Top** - Reminder and workout windows always appear on top of other applications
⚙️ **Customizable Settings** - Adjust reminder intervals and enable/disable autostart
🚀 **Windows Autostart** - Optionally launch the app automatically at Windows startup
🎨 **Beautiful UI** - Modern, high-contrast interface with large, readable text

### Installation

#### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Windows 10 or higher

#### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LizaGhost/eye-care-app.git
   cd eye-care-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development

#### Run in Development Mode

```bash
npm run dev
```

This will:
- Start the TypeScript compiler in watch mode for the main process
- Launch the Electron app with hot-reload capabilities
- Open DevTools for debugging

#### Build for Production

```bash
npm run build
```

Compiles TypeScript files from `src/` to `dist/`

#### Package for Windows

```bash
npm run pack
```

Creates a Windows installer (.exe) and portable version in the `dist/packages/` directory

### Project Structure

```
eye-care-app/
├── src/
│   ├── main/
│   │   ├── index.ts          # Main process entry point
│   │   └── scheduler.ts      # Reminder scheduler logic
│   ├── renderer/
│   │   ├── main.ts           # Settings window script
│   │   ├── reminder.ts       # Reminder window script
│   │   └── workout.ts        # Workout window script
│   ├── preload/
│   │   └── preload.ts        # IPC bridge between main and renderer
│   └── shared/
│       ├── config.ts         # Configuration types and defaults
│       └── workout.ts        # Exercise definitions and utilities
├── public/
│   ├── index.html            # Settings window UI
│   ├── reminder.html         # Reminder window UI
│   └── workout.html          # Workout window UI
├── dist/                     # Compiled output (generated)
├── config.json               # Runtime configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── electron-builder.yml      # Build and packaging config
```

### Configuration

The app stores settings in `config.json`:

```json
{
  "intervalMinutes": 60,
  "workoutSeconds": 300,
  "autoStartEnabled": true
}
```

- **intervalMinutes**: How often to show reminders (default: 60)
- **workoutSeconds**: Duration of each workout session (default: 300)
- **autoStartEnabled**: Launch app at Windows startup (default: true)

Settings can be modified through the app's UI.

### The 7 Eye Exercises

Each workout guides you through these exercises (≈43 seconds each):

1. **Моргание** (Blinking) - Blink 20-30 times, then take 3 calm breaths
2. **Пальминг** (Palming) - Cover eyes with palms, maintain darkness for 40 seconds
3. **Взгляд близко-дальше** (Near-Far Focus) - Look at finger, then far away, repeat 4-5 times
4. **Круги глазами** (Eye Circles) - Draw circles with your eyes clockwise and counterclockwise
5. **Вверх-вниз** (Up-Down) - Slowly move gaze up and down, 10 repetitions
6. **Лево-право** (Left-Right) - Slowly move gaze left and right, 10 repetitions
7. **Фокус на точке** (Point Focus) - Focus on a single point for 20-30 seconds, then relax

### UI Components

#### Settings Window
- Set reminder interval (1-180 minutes)
- Enable/disable Windows autostart
- Save settings with immediate scheduler restart

#### Reminder Window
- High-contrast bright red design
- Large "Eye Care" heading
- Call-to-action message
- Two buttons: "Start Workout" and "Dismiss"
- Always appears on top of other windows

#### Workout Window
- Real-time countdown timer (MM:SS format)
- Progress bar (0-100%)
- Current exercise (X/7)
- Exercise name and detailed instructions
- Remaining time in current exercise
- Completion screen with summary
- User cannot skip exercises (no postpone button)

### Troubleshooting

#### App doesn't start

1. Make sure all dependencies are installed: `npm install`
2. Check that you're on Windows 10 or higher
3. Try rebuilding: `npm run build`

#### Reminders not showing

1. Check that `intervalMinutes` in config.json is set correctly
2. Ensure autostart setting is enabled if you want reminders after restart
3. Check the console for scheduler errors (DevTools in dev mode)

#### Build/Pack issues

1. Clear the dist folder: `rm -r dist`
2. Rebuild: `npm run build`
3. Try packing again: `npm run pack`

### Development Notes

- **IPC Communication**: Main process communicates with renderer processes through secure IPC channels
- **Context Isolation**: Enabled for security - renderer processes can only call exposed APIs
- **Timing**: Workout timer uses Date.now() for accurate timing without drift
- **Window Management**: Reminder and workout windows are created on-demand and managed by the main process

### Building for Distribution

To create a distributable package:

```bash
npm run pack
```

This generates:
- `Eye Care-1.0.0.exe` - Windows installer (NSIS)
- `Eye Care-1.0.0.exe` - Portable version

The installer includes:
- Start menu shortcuts
- Desktop shortcut
- Uninstaller
- Autostart support

### License

MIT

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Support

For issues or feature requests, please open an issue on GitHub.

---

**Take care of your eyes! 👀**
