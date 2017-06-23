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


Implement listener in your Home Automation System
-------------------------------------------------

### OpenHAB

Items:

	Group:Switch:SUM Presence "Peolpe at home: [%d]" <presence>
	  Group:Switch:MAX Person_1 "Person 1 [%d]" <man> (Presence)
	    Switch Person_1_Geofency "Person 1 Geofency [%s]" (Person_1)
	    Switch Person_1_Wifi "Person 1 Wifi [%s]" (Person_1)
	  Group:Switch:MAX Person_2 "Person 2 [%d]" <woman> (Presence)
	  	Switch Person_2_Wifi "Person 2 Wifi [%s]" (Person_2)

	DateTime Person_1_Wifi_LastSeen         "Person 1 Wifi last seen [%1$td.%1$tm.%1$tY %1$tH:%1$tM]" { mqtt="<[mosquitto:/presence/wifi/00-00-00-00-00-00:state:default]" }
	Number   Person_1_Wifi_LastSeen_Seconds "Person 1 Wifi last seen [%d]" { mqtt="<[mosquitto:/presence/wifi/00-00-00-00-00-00/seconds:state:default]" }
	DateTime Person_2_Wifi_LastSeen         "Person 2 Wifi last seen [%1$td.%1$tm.%1$tY %1$tH:%1$tM]" { mqtt="<[mosquitto:/presence/wifi/00-00-00-00-00-00:state:default]" }
	Number   Person_2_Wifi_LastSeen_Seconds "Person 2 Wifi last seen [%d]" { mqtt="<[mosquitto:/presence/wifi/00-00-00-00-00-00/seconds:state:default]" }

	Switch   Person_1_Wifi_Event            "Person 1 Wifi Event [%s]" { mqtt="<[mosquitto:/presence/wifi/00-00-00-00-00-00/event:state:MAP(presence_event.map)]" }
	Switch   Person_2_Wifi_Event            "Person 2 Wifi Event [%s]" { mqtt="<[mosquitto:/presence/wifi/00-00-00-00-00-00/event:state:MAP(presence_event.map)]" }

Map file `presence_event.map`:

	new=ON
	del=OFF

Rule:

	rule "Wifi Detection"
	when
		Time cron "30 * * * * ?"
	then
		var Number now_ms = now.millis
		var Number Person_1_Wifi_LastSeen_Millis = (Person_1_Wifi_LastSeen_Seconds.state as Number) * 1000
		var Number Person_2_Wifi_LastSeen_Millis = (Person_2_Wifi_LastSeen_Seconds.state as Number) * 1000

		logInfo("Wifi Detection", "Millis since last seen P1: "+(now_ms - Person_1_Wifi_LastSeen_Millis))
		logInfo("Wifi Detection", "Millis since last seen P2: "+(now_ms - Person_2_Wifi_LastSeen_Millis))

		// Set timeout for each Person. For e.g. 4min here.
		if ( (now_ms - Person_1_Wifi_LastSeen_Millis) < 4*60*1000 ) {
			logInfo("Wifi Detection", "Person_1 still here")
			Person_1_Wifi.setState(ON)
		} else {
			logInfo("Wifi Detection", "Person_1 not here")
			Person_1_Wifi.setState(OFF)
		}
		if ( (now_ms - Person_2_Wifi_LastSeen_Millis) < 4*60*1000 ) {
			logInfo("Wifi Detection", "Person_2 still here")
			Person_2_Wifi.setState(ON)
		} else {
			logInfo("Wifi Detection", "Person_2 not here")
			Person_2_Wifi.setState(OFF)
		}
	end

	rule "Wifi Event Person_1"
		when
			Item Person_1_Wifi_Event received update
		then
			if ( Person_1_Wifi_Event.state == ON ) {
				logInfo("Wifi Detection", "Person_1 came home (Wifi Event)")
				Person_1_Wifi.setState(ON)
			}
			if ( Person_1_Wifi_Event.state == OFF ) {
				logInfo("Wifi Detection", "Person_1 left (Wifi Event)")
				Person_1_Wifi.setState(OFF)
			}
	end
	rule "Wifi Event Person_2"
		when
			Item Person_2_Wifi_Event received update
		then
			if ( Person_2_Wifi_Event.state == ON ) {
				logInfo("Wifi Detection", "Person_2 came home (Wifi Event)")
				Person_2_Wifi.setState(ON)
			}
			if ( Person_2_Wifi_Event.state == OFF ) {
				logInfo("Wifi Detection", "Person_2 left (Wifi Event)")
				Person_2_Wifi.setState(OFF)
			}
	end

Credits
-------

Original idea and script from [Jupiter "belikh" Belic](http://community.openhab.org/users/belikh). Suggestion to use `iw event` from [Tom "tomdee" Denham](https://github.com/tomdee).