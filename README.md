# Baladi local MVP

This repository contains a local API, a citizen Expo app, and a municipality Next.js dashboard. Both interfaces use the same reports in `data/reports.json`.

## Install packages

From the repository root:

```powershell
npm.cmd --prefix apps/server install
npm.cmd --prefix apps/mobile install
```

The API uses port `4000` and listens on `0.0.0.0`, allowing LAN connections. Reports are stored in `data/reports.json`; uploaded images are stored in `uploads/`.

## Start the mobile app

From the repository root, run `ipconfig` in PowerShell. Use the IPv4 Address under the active Wi-Fi adapter, not a virtual adapter. Create or update `apps/mobile/.env` (the `.env.example` file is only a template) with your current address:

```text
EXPO_PUBLIC_API_URL=http://MY_LAPTOP_IP:4000
EXPO_PUBLIC_USE_RN_FETCH=1
```

Replace `MY_LAPTOP_IP` with the actual Wi-Fi IPv4 address. Use the laptop address, never `localhost`, because the app runs on the phone. Stop both running processes with Ctrl+C, then restart them in separate PowerShell terminals:

```powershell
cd C:\Users\PALpro\Desktop\Baladi\apps\server
npm run dev
```

```powershell
cd C:\Users\PALpro\Desktop\Baladi\apps\mobile
npm run start -- --clear
```

Open the Expo QR code in Expo Go. The phone and laptop must be on the same Wi-Fi. Allow Node.js through the Windows firewall on private networks if prompted; the phone must reach port 4000. If the LAN QR code cannot connect, check that the firewall permits Expo's development server too. After changing `.env`, stop Expo and start it again; reloading inside Expo Go alone does not reload environment variables. If Expo Go initially shows a left-to-right layout, reload the app once so React Native applies the RTL setting.

## Demo flow

Start the server, then Expo. On the phone, open بلدي → بلّغ عن مشكلة, add category, description, photo and current location, then submit. The API returns a ticket number and writes the report into `data/reports.json`. Open بلاغاتي to see it. Pull down to refresh reports and details after API changes.

The seed reports are available immediately. There is no authentication; all reports on this local server appear in بلاغاتي. The current location is used as the report location; manual map selection is not included. Images are local to the laptop and available only while the API runs.

For a repeatable API smoke check while the server runs, use `node apps/server/scripts/smoke.mjs` from the repository root. It submits a temporary report with an image, reads and updates it, checks the list, then removes its test data.

## Start the municipality dashboard

Keep the API running on port `4000`. In another PowerShell terminal, from the repository root:

```powershell
npm.cmd --prefix apps/admin install
npm.cmd run admin
```

Open `http://localhost:3000` on the laptop. The dashboard uses `http://localhost:4000` by default. To change the API address, create `apps/admin/.env.local` with `NEXT_PUBLIC_API_URL=http://YOUR_LAPTOP_IP:4000` and restart Next.js. The mobile app keeps its separate `apps/mobile/.env` setting.

Open البلاغات to see the same reports that appear in the mobile app. Open a report, choose a department, change status, write a municipality note, and save. Refresh the report in the mobile app to see the status and note. The map uses OpenStreetMap tiles and needs internet for the map background; report coordinates and the rest of the dashboard still use the local API.
