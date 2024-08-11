#!/bin/bash

get_cpu_usage() {
    cpu_usage="$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')"
    echo "(box :class \"cpu\" :orientation \"horizontal\" (circular-progress :value $cpu_usage :thickness 10 :start-at 75))"
}

while true
do
    get_cpu_usage
done