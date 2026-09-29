---
# ─────────────────────────────────────────────────────────────────────────────
# REQUIRED — the layout, and the four fields every card/header needs.
# ─────────────────────────────────────────────────────────────────────────────
layout: ../../layouts/ArticleLayout.astro
title: "How to root OnePlus 7 Pro Android Phone"
description: "OnePlus 7 Pro is one of the prime candidates for a Kali Nethunter installation and rooting the phone gives you great capabilities."
pubDate: 2026-09-29
category: "Tutorials"        # Exploits | Crypto | Defensive Ops  (add more in src/lib/categories.js)

# ─────────────────────────────────────────────────────────────────────────────
# OPTIONAL — delete any line you don't need.
# ─────────────────────────────────────────────────────────────────────────────
heroImage: "/images/linux-fundamentals.jpg"   # full-bleed image under the header.
                                              # Path is relative to src/assets, so this file
                                              # lives at src/assets/images/linux-fundamentals.jpg
heroImageAlt: "A terminal session on a dark background"
author: "Neekoy"                 # defaults to "Neekoy" when omitted
cve: ""                          # e.g. "CVE-2026-41880" — renders next to the category
cvss:                            # e.g. 9.8 — renders the red CVSS badge (header + card)
tags: ["kali linux", "root android"]
draft: true                     # true hides the post from the feed, nav and 404 list
# readingTime: DO NOT SET — computed from the body at ~200 wpm
---

After some trial and error, and a couple of times bricking the phone (:D), I was able to root the Android 7 Pro phone,
and install Kali Nethunter Linux on it. I set up the Rootless version but still gave it root access, which gives most
capabilities (you just can't run BadUSB and WiFi attacks).

## Rooting the phone

These are the fully detailed step-by-step instructions that will get you through the whole process. Everything is explained
and you don't need any previous experience to understand what and how to do each step.

1. **Enable Developer Options, USB debugging, and OEM unlocking**

> Unlock your phone and open the "Settings" app (the gear icon). Scroll all the way down and tap "About phone." On that screen, find the row labeled "Version" and tap it — this opens a sub-screen showing your build number. Tap directly on the "Build number" line (not Android version) seven times in a row, quickly. After a few taps you'll see a small popup counting down ("You are now 4 steps away from being a developer," etc.); keep tapping until it says "You are now a developer!" It may ask for your PIN/pattern — enter it if so. Now go back to the main Settings screen (tap the back arrow twice), scroll down, and you'll see a new entry called "System" → "Developer options" (or just "Developer options" directly in the list, depending on the exact menu). Tap into it. If there's a toggle switch at the very top of this screen, turn it on. Scroll down inside Developer options and find "USB debugging" — tap its toggle to turn it on, then tap "OK" on the confirmation popup that appears. Scroll further to find "OEM unlocking" (sometimes phrased "Enable OEM unlock") — tap its toggle on as well. If it's greyed out and won't toggle, that means the phone doesn't have an active internet connection yet (OnePlus checks with their server before allowing this) — connect to Wi-Fi first, then try again.

2. **Connect the phone to your Mac and authorize ADB debugging**

> Plug your OnePlus 7 Pro into your Mac Mini using a USB-C cable (USB-C on both ends). On the phone screen, a popup should appear titled something like "Allow USB debugging?" showing a long string of letters/numbers (your Mac's RSA key fingerprint). Check the box that says "Always allow from this computer," then tap "Allow." If this popup doesn't appear on its own: open Terminal on your Mac, navigate to the folder with your platform-tools (the same folder where fastboot lives — e.g. "cd ~/platform-tools" or wherever you extracted it), and run "./adb devices" — this itself often triggers the popup on the phone. Accept it, then run "./adb devices" again. You should now see a line with a long serial number followed by the word "device" (not "unauthorized" or blank) — that confirms the connection is working.

3. **Reboot the phone into fastboot mode**

> With the phone still connected and authorized, in the same Terminal window run: "./adb reboot bootloader" — the phone's screen will go black and then show a small menu with white/green text, usually reading something like "FASTBOOT MODE" near the top. That's the bootloader/fastboot screen. (Alternative, if ADB isn't cooperating: fully power off the phone by holding the power button and choosing "Power off," wait until the screen is completely black for a few seconds, then hold Volume Up + Power together until the same fastboot screen appears — then let go of both buttons.) Once you see that screen, go back to Terminal and run "./fastboot devices" — it should print your phone's serial number, confirming the computer can talk to it in this mode.

4. **Unlock the bootloader**

> In Terminal, run: "./fastboot flashing unlock". The phone's screen will change to a plain black warning screen with text explaining that unlocking voids warranty and wipes all data, with menu options below it (usually something like "Unlock the bootloader" and "Cancel"). You navigate this menu using the phone's physical Volume Up and Volume Down buttons to move the highlighted selection up and down, and the Power button to confirm whichever option is currently highlighted. Press Volume Up/Down until "Unlock the bootloader" (or similarly worded "Yes"/"Confirm") is highlighted, then press the Power button once to select it. The phone will immediately start wiping itself and reboot on its own — this can take a few minutes. Just wait; don't unplug or touch anything until it finishes booting all the way to the OxygenOS setup/welcome screen.

5. **Get through setup again and re-enable USB debugging**

> Because the unlock wiped the phone, you're back at the initial setup wizard (language selection, Wi-Fi, etc.). You can tap through it quickly — select your language, connect to Wi-Fi if you want (not strictly required for this step, but makes the next part easier), and you can skip Google sign-in for now if you prefer, since we're about to reboot again soon anyway. Once you reach the home screen, repeat exactly what you did in Step 1: Settings → About phone → Version → tap Build number 7 times → go to Developer options → turn on USB debugging again (this setting resets after every full wipe). You do NOT need to toggle OEM unlocking again — it should now show as already unlocked, sometimes with the toggle greyed out saying something like "already unlocked," which is expected. Plug the USB cable back in and accept the "Allow USB debugging?" popup again the same way as Step 2. Confirm with "./adb devices" in Terminal that it shows your device again.

6. **Identify and download the exact matching OxygenOS firmware**

> Double check your exact build by going to Settings → About phone → Version again — it should still read "11.0.5.1" with variant "GM21BA." The exact matching firmware file is: filename "OnePlus7ProOxygen_21.E.41_GLO_0410_2112101752.zip", MD5 checksum "7821615F0EE5B967C3D23747FE53F47C". The easiest way to actually get this file onto your Mac: install the "Oxygen Updater" app (available on the Google Play Store, or F-Droid) on any Android device, open it, select "OnePlus 7 Pro" and the European region, and it will locate and let you download this exact full OTA zip directly, handling OnePlus's server requirements automatically. Alternatively, manually: search for the XDA thread titled "[OnePlus 7 Pro (5G)][ROM][OTA][Oxygen OS] Repo of Oxygen OS Builds" and look for the "11.0.5.1 GM21BA Europe" entry — if the link points to a onePlus server address containing "gauss-component" and fails or hangs in a normal browser download, install a download manager via "brew install aria2" on your Mac and download it with "aria2c -x16 -s16 -j5 \"<the URL>\"" in Terminal, which handles the multi-connection download OnePlus's changed backend now requires.

7. **Extract boot.img and patch it with Magisk**

> Once you have the OTA zip on your Mac, unzip it (double-click it in Finder, or run "unzip OnePlus7ProOxygen_21.E.41_GLO_0410_2112101752.zip -d oos_11051" in Terminal from wherever you saved it). Inside, you'll find a file called "payload.bin" — this contains every partition image in a single compressed file. Install the extraction tool via Terminal: "brew install payload-dumper-go" (this also installs its one dependency, "xz," automatically). Then run: "payload-dumper-go -o extracted -partitions boot oos_11051/payload.bin" (adjust the path if your folder names differ) — this creates a new folder called "extracted" containing just "boot.img," the one file you actually need, rather than extracting everything (which would take much longer and use far more disk space). Next, download the Magisk app: go to github.com, search for "topjohnwu/Magisk," go to its "Releases" page, and download the latest ".apk" file directly onto your phone (or download it on your Mac and transfer it: "adb push Magisk.apk /sdcard/Download/"). On the phone, open your Files app, navigate to Downloads, tap the Magisk APK, and follow the prompts to install it (you may need to allow "install from unknown sources" the first time — Android will prompt you and let you enable this directly from that same install screen). Also transfer boot.img to the phone: "adb push extracted/boot.img /sdcard/Download/". Open the Magisk app on the phone, tap "Install" near the top, choose "Select and Patch a File," browse to Downloads, select "boot.img," and tap through to let it patch. When done, it'll show a filename like "magisk_patched-XXXXX_abcde.img" saved in your phone's Downloads folder — note this exact filename, you'll need it next.

8. **Flash the patched boot image and verify root**

> Back in Terminal on your Mac, pull the patched file off the phone: "adb pull /sdcard/Download/magisk_patched-XXXXX_abcde.img ." (replace with the exact filename Magisk gave you, and note the period at the end, which means "save it in my current folder"). Now reboot the phone into fastboot mode again, the same way as Step 3 ("./adb reboot bootloader", or the Volume Up + Power combo). Once in fastboot mode, run "./fastboot getvar current-slot" — this prints either "a" or "b", telling you which boot slot is currently active. Then flash the patched image to that exact slot: if it said "a", run "./fastboot flash boot_a magisk_patched-XXXXX_abcde.img"; if it said "b", run "./fastboot flash boot_b magisk_patched-XXXXX_abcde.img" (using the real filename you pulled). Once that finishes successfully, run "./fastboot reboot" to boot the phone normally. After it boots, open the Magisk app again — it should now show itself as properly "Installed" with a version number, rather than just detected. You can further confirm by installing any app that requests root access (or a dedicated root-checker app) and confirming Magisk prompts you to grant it access.

## Resetting the phone if you brick it

The instructions above are sound and tested, but if you do something wrong it's possible to brick your phone. The good thing is that it's possible to restore it even if you brick it, but you'll need a Windows machine.

Here's how to go about restoring the phone to a default state:

1. **Download the "Qualcomm HS-USB QDLoader 9008" driver and install it**

> Be careful here because there are versions on the internet with viruses in the driver (my antivirus flagged a couple of them). Scan the file before installing it! You should be able to find a clean file on the One Plus Forums. Unfortunately those forums are the only place you can find most of the software related to the device nowadays. Once you download the file, install the driver from the .exe file, and restart your computer so it can boot into development mode.

2. **Download the MSM Download Tool**

> This is the software that will restore your phone. Now find the version of Android you want to install. In my case it was Android 11, so I searched for "MSM Download Tool Android 11". It will be a 2-3 GB file, that you can get again from a link in the One Plus forums. Download and unzip that. Then you need to start the application as Administrator from the "MSM Download Tool" exe file.

3. **Plug in the phone**

> Now you need to connect the phone with USB to the Windows machine. You can do this by holding the Volume Up and Volume Down buttons at the same time, and plugging in the phone while you're holding them. This will run the emergency connection shell which doesn't depend on the phone being functional. It can be completely bricked and this will still connect.

3. **Make sure your driver is properly recognised**

> Go to "Start menu" -> "Device Manager" and in there look for the "Qualcomm" device. The device should not have a yellow warning triangle, and should display that it's operational when you right-click on it and go to Properties. If there is an issue, there will be a yellow triangle over the icon, and when you go to Properties you can identify the exact issue. Just Google the error message and you can find guides on how to fix it.

4. **Open MSM Download Tool and run it**

> Since you already started MSM Download Tool, you should look for "Status of Connection" and it should say "Connected". Now you can just click "Run" on the right side of the app, and wait for 5-10 minutes for the process to complete. Once that's done, you can unplug your phone, start it normally, and you should see the default Android setup screen, which looks exactly like the one when you bought the phone.

## Installing Kali Nethunter

I tried many versions of the full Kali Nethunter application, but every single one of them bricked my phone. For that reason, I had to settle for the Rootless version, which is still pretty capable and nice. Here's step-by-step instructions on how to set it up:

1. **Install Termux from F-Droid**

> Search F-Droid (F-Droid.org or the F-Droid app if you have it) for "Termux" and install it — this is the officially recommended source, since the Play Store version stopped receiving updates years ago and is explicitly discouraged by both Termux's and Kali's own documentation.

2. **Install the NetHunter Store, KeX client, and Hacker's Keyboard**

> Kali's official install flow also has you install the "NetHunter-Store" app from store.nethunter.com, then from within it install "NetHunter-KeX client" and "Hacker's Keyboard" (a more terminal-friendly keyboard with easy access to symbols like | and ~). None of this touches root or the system — they're just regular apps.

3. **Run the official installer script inside Termux**

> Open Termux and run, one at a time: "termux-setup-storage" (grants storage access, accept the permission prompt), then "pkg install wget", then "wget -O install-nethunter-termux https://offs.ec/2MceZWr", then "chmod +x install-nethunter-termux", then "./install-nethunter-termux". This downloads and sets up the Kali rootfs — roughly 1.5–2GB, so give it time on a decent connection.

4. **Start using it**

> Type "nethunter" (or the shorthand "nh") to drop into a Kali shell. Since you have Magisk root available, "nethunter -r" gives you a root-enabled session instead. For the desktop experience, "nethunter kex passwd" sets a password (first time only), then "nethunter kex &" starts it — open the NetHunter-KeX client app, enter that password, and connect to get a full graphical Kali desktop on your phone's screen.

This is it, you now have a rooted Android phone with Kali Nethunter on it! :)

## BONUS - installing a BadUSB application

The Rootless Kali Nethunter cannot run BadUSB workloads. But that shouldn't discourage you, because there is a separate application that you can download for that functionality.

Just go to F-Droid (our special Application Store) and look for "TapDucky". It's a BadUSB application that needs root (which you already have) and you can use it to run payloads on any computer that's connected via USB to this phone. You can also schedule payloads so they don't run immediately on connection, which would make it far too obvious.

You can have lots of fun with this device.

## DISCLAIMER

Only use these applications on software and hardware you own, or have explicit permission to access and hack. Using these applications on software / hardware you don't own is ILLEGAL and can land you in JAIL.
