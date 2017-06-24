Installation
------------

### Install the MQTT client

Install the packages

- `mosquitto-client`
- `coreutils-nohup`

with either luci or opkg.

### Create user (optional)

It's recommended that you create a new user on your OpenWRT Router for this. Better don't use root for this script (just in case).

Unfortunatedly there isn't something like `adduser` available, so edit the configuration files manually. I recommend doing this via SCP or using nano on the command line:

In `/etc/passwd`:

	presencedetector:*:1001:1001:presencedetector:/:/bin/false

In `/etc/group`:

	presencedetector:x:1001:

In `/etc/shadow`:

	presencedetector:x:0:0:99999:7:::

### Copy over the scripts

Again, use SCP for that or Copy&Paste the contents via command line. I'd recommend to place them under

- `/usr/bin/presence_detection.sh`
- `/usr/bin/presence_event.sh`

### Create Cron job

Create initial contab:

	crontab -e -u presencedetector

Add a line for the script:

	*/1 * * * * /usr/bin/presence_detection.sh

Enable Cron:

	/etc/init.d/cron start
	/etc/init.d/cron enable

### Add event-based script to rc.local

Place the following line

	nohup /usr/bin/presence_event.sh >/dev/null 2>&1 &

inside the `/etc/rc.local` file before the `exit 0`. You can to this via command-line or via LuCI in System -> Startup -> Local Startup. The script will be executed after reboot.


Credits
-------

Original idea and script from [Jupiter "belikh" Belic](http://community.openhab.org/users/belikh). Suggestion to use `iw event` from [Tom "tomdee" Denham](https://github.com/tomdee).