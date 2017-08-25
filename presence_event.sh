#!/bin/sh

MQTT_SERVER="10.1.1.50"
MQTT_ID="OpenWRT-Presence-Event"
MQTT_TOPIC="owrtwifi/status/mac-"

iw event | \
while read LINE; do
    if echo $LINE | grep -q -E "(new|del) station"; then
        EVENT=`echo $LINE | awk '/(new|del) station/ {print $2}'`
        MAC=`echo $LINE | awk '/(new|del) station/ {print $4}'`

        #echo "Mac: $MAC did $EVENT"
        mosquitto_pub -h $MQTT_SERVER -i $MQTT_ID -t "${MQTT_TOPIC}${MAC//:/-}/event" -m $EVENT  
    fi
done