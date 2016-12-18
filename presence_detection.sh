#!/bin/sh

MQTT_SERVER="10.1.1.50"
MQTT_ID="Router"
MQTT_TOPIC="/presence/wifi/"

for interface in `iw dev | grep Interface | cut -f 2 -s -d" "`
do
  # for each interface, get mac addresses of connected stations/clients
  maclist=`iw dev $interface station dump | grep Station | cut -f 2 -s -d" "`
  
  # for each mac address in that list...
  for mac in $maclist
  do
    mosquitto_pub -h $MQTT_SERVER -i $MQTT_ID -t "${MQTT_TOPIC}${mac//:/-}" -m $(date +%Y-%m-%dT%H:%M:%S.000%z)
  done
done
