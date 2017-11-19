"use strict";

// Vanderbilt SPC Area Device
const Homey = require('homey');
var spc = require('spc-api');

class AreaDevice extends Homey.Device {

    // Device init
    onInit() {
        var self = this;
        self.log('Init device ' + self.getName());
        spc.addAreaDevice(self.getDriver(), self.getData(), self.getName);

        this.setCapabilityValue('arm_mode', spc.getAreaValue(self.getData().panel, self.getData().area, 'arm_mode'));
        this.setCapabilityValue('alarm', spc.getAreaValue(self.getData().panel, self.getData().area, 'alarm'));

        //  Capability listener
        this.registerMultipleCapabilityListener(['alarm_unset', 'alarm_fullset', 'alarm_partset_a', 'alarm_partset_b'], function(valueObj, optsObj) {
             var command = null;
             if (valueObj.alarm_unset) {
                 command = 'unset';
             } else if (valueObj.alarm_fullset) {
                 command = 'set';
             } else if (valueObj.alarm_partset_a) {
                 command = 'set_a';
             } else if (valueObj.alarm_partset_b) {
                 command = 'set_b';
             }
             if (command) {
                 spc.setAreaArmMode(self.getData().panel, self.getData().area, command, function(err, success) {
                     if (err) {
                         var errMsg = 'Area arm command ' + command + ' failed. Reason: ' ;
                         spc.debug(errMsg, err);
                     }
                 });
             }
             return Promise.resolve();
        }, 100);
    }

    // Device added
    onAdded() {
        this.log('Device added ' + this.getName());
        spc.updateDeviceName(this.getData(), this.getName());
    }

    // Device renamned
    onRenamed(new_name) {
        this.log('Device renamned to ' + new_name);
        spc.updateDeviceName(this.getData(), new_name);
    }

    // Device deleted
    onDeleted() {
        this.log('Device deleted ' + this.getName());
        spc.deleteAreaDevice(this.getData());
    }

    // Device settings changed
    onSettings(oldSettings, newSettings, changedKeys, callback) {
        this.log('Device settings changed ' + this.getName());
        callback();
    }
}
module.exports = AreaDevice;
