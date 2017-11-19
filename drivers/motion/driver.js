"use strict";

// Vanderbilt SPC Contact Sensor Driver 

const Homey = require('homey');
const SensorDriver = require('../sensor_driver.js');

class MotionDriver extends SensorDriver {
    sensorType() {
       return 'motion';
    }
}

module.exports = MotionDriver;
