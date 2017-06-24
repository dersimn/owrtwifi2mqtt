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

### Copy over the script

Again, use SCP for that or Copy&Paste the contents via command line.

### Create Cron job

Create initial contab:

	crontab -e -u presencedetector

Add the line to your command, for e.g.:

	*/1 * * * * /usr/bin/presence_detection.sh

Enable Cron:

	/etc/init.d/cron start
	/etc/init.d/cron enable


Credits
-------

Original idea and script from [Jupiter "belikh" Belic](http://community.openhab.org/users/belikh). Suggestion to use `iw event` from [Tom "tomdee" Denham](https://github.com/tomdee).