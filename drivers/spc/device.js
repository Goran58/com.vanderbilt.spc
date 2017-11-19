'use strict'

const Homey = require('homey');
const spc = require('spc-api');

// Vanderbilt SPC Device
class SpcDevice extends Homey.Device {

    onInit () {
        var self = this;
        self.log('Init device ' + self.getName());
        spc.addPanel(self.getDriver(), self.getData(), self.getName(), self.getSettings());

        this.setCapabilityValue('arm_mode', spc.getPanelValue(self.getData().panel, 'arm_mode'));
        this.setCapabilityValue('alarm', spc.getAreaValue(self.getData().panel, 'alarm'));

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
                 spc.setPanelArmMode(self.getData().id, command, function(err, success) {
                     if (err) {
                         var errMsg = 'Panel arm command ' + command + ' failed. Reason: ' ;
                         spc.debug(errMsg, err);
                     }
                 });
             }
             return Promise.resolve();
        }, 100);
    }

    // Device added
    onAdded () {
        this.log('Device added ' + this.getName());
        spc.updatePanelName(this.getData().id, this.getName());
    }

    // Device deleted
    onDeleted () {
        this.log('Device deleted ' + this.getName())
        spc.deletePanel(this.getData().id);

        // Reset global settings
        Homey.ManagerSettings.unset('spc_bridge_data');
    }

    // Device renamned
    onRenamed(new_name) {
        this.log('Device renamned ' + new_name)
        spc.updatePanelName(this.getData().id, new_name);
    }

    // Device settings changed
    onSettings(oldSettingsObj, newSettingsObj, changedKeys, callback) {
        var self = this;
        this.log('Device settings changed ' + this.getName())
        spc.reconnectPanel(this, newSettingsObj, function(err, success) {
            callback(err, success); // Show message box with result
        });
    }
}

module.exports = SpcDevice
