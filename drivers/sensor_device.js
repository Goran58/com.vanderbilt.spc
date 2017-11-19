"use strict";

// Vanderbilt SPC Sensor Device

const Homey = require('homey');
var spc = require('spc-api');

class SensorDevice extends Homey.Device {

    // Device init
    onInit() {
        var self = this;
        spc.addSensorDevice(self.getDriver(), self.getData(), self.getName());

        this.setCapabilityValue('zone_alarm', spc.getZoneValue(self.getData().panel, self.getData().zone, 'zone_alarm'));
        this.setCapabilityValue('zone_state', spc.getZoneValue(self.getData().panel, self.getData().zone, 'zone_state'));
        this.setCapabilityValue('zone_status', spc.getZoneValue(self.getData().panel, self.getData().zone, 'zone_status'));
    }

    // Device added
    onAdded() {
        spc.updateDeviceName(this.getData(), this.getName());
    }

    // Device deleted
    onDeleted() {
        spc.deleteSensorDevice(this.getData());
    }

    // Device renamned
    onRenamed(new_name) {
        spc.updateDeviceName(this.getData(), new_name);
    }


    // Device settings changed
    onSettings(oldSettingsObj, newSettingsObj, changedKeys, callback) {
        this.log('Device settings changed ' + this.getName())
        callback();
    }
}

module.exports = SensorDevice;
