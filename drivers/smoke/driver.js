"use strict";

// Vanderbilt SPC Smoke Sensor Driver 

const Homey = require('homey');
const SensorDriver = require('../sensor_driver.js');

class SmokeDriver extends SensorDriver {
    sensorType() {
       return 'smoke';
    }
}

module.exports = SmokeDriver;
