"use strict";

// Vanderbilt SPC Contact Sensor Driver 

const Homey = require('homey');
const SensorDriver = require('../sensor_driver.js');

class ContactDriver extends SensorDriver {
    sensorType() {
       return 'window';
    }
}

module.exports = ContactDriver;
