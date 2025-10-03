#!/bin/bash
export ELECTRON_DISABLE_SANDBOX=1
export ELECTRON_OZONE_PLATFORM_HINT=x11
./node_modules/.bin/electron .

