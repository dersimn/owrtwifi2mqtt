Installation
------------

### Install the MQTT client

Install the packages

- `mosquitto-client`
- `coreutils-nohup`

with either luci or opkg.

### Copy over the scripts

Use SCP for that or Copy & Paste the contents via command line. When trying to use SCP with Cyberduck/Transmit on macOS, see this [article](https://wiki.openwrt.org/doc/howto/sftp.server).  
I'd recommend to place them in:

- `/usr/bin/presence_lastseen.sh`
- `/usr/bin/presence_event.sh`

### Create Cron job

Create initial contab:

	crontab -e

Add a line for the script:

	*/1 * * * * /usr/bin/presence_lastseen.sh

Enable Cron:

	/etc/init.d/cron start
	/etc/init.d/cron enable

### Add event-based script to rc.local

Place the following line

	nohup /usr/bin/presence_event.sh >/dev/null 2>&1 &

inside the `/etc/rc.local` file before the `exit 0`. You can to this via command-line or via LuCI in System -> Startup -> Local Startup. The script will be executed after reboot.

Usage
-----

After installation the following topics will be published for each WiFi device, using the _lowercase_ MAC address:

	owrtwifi/status/mac-00-00-00-00-00-00/lastseen

Payload contains the timestamp when the device was seen in an OpenHAB-compatible `DateTime` format, like this: `2017-08-25T19:29:57.000+0200`

	owrtwifi/status/mac-00-00-00-00-00-00/lastseen/epoch

Unix epoch in seconds

	owrtwifi/status/mac-00-00-00-00-00-00/event

Message will be `new` or `del` and is sent right after the device connected/disconnected to/from WiFi.


Credits
-------

Original idea and script from [Jupiter "belikh" Belic](http://community.openhab.org/users/belikh). Suggestion to use `iw event` from [Tom "tomdee" Denham](https://github.com/tomdee). This script follows [Oliver "owagner" Wagner](https://github.com/owagner)'s architectural proposal for an [mqtt-smarthome](https://github.com/mqtt-smarthome/mqtt-smarthome).