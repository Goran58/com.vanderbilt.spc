"use strict";

// Vanderbilt SPC Sensor Driver

const Homey = require('homey');
var spc = require('spc-api');

class SensorDriver extends Homey.Driver {

    // Sensor type is set to proper type in extended class
    sensorType() {
       return '';    
    }

    onInit() {
        var stype = this.sensorType();
        // Register flow triggers
        this._flowTriggerZoneAlarmOn = new Homey.FlowCardTriggerDevice('zone_' + stype + '_alarm_on')
            .register()

        this._flowTriggerZoneAlarmOff = new Homey.FlowCardTriggerDevice('zone_' + stype + '_alarm_off')
            .register()

        this._flowTriggerZoneStateTo = new Homey.FlowCardTriggerDevice('zone_' + stype + '_state_to')
            .register()
            .registerRunListener(function(args, state) {
                return Promise.resolve( Number(args.values) === Number(state.value) );
            })

        this._flowTriggerZoneStateFrom = new Homey.FlowCardTriggerDevice('zone_' + stype + '_state_from')
            .register()
            .registerRunListener(function(args, state) {
                var trigg = false;
                if (state.current != undefined && Number(args.values) == Number(state.current) && Number(state.value) != Number(state.current)) {
                    trigg = true;
                }
                return Promise.resolve(trigg);
            })

        this._flowTriggerZoneStatusTo = new Homey.FlowCardTriggerDevice('zone_' + stype + '_status_to')
            .register()
            .registerRunListener(function(args, state) {
                return Promise.resolve( Number(args.values) === Number(state.value) );
            })

        this._flowTriggerZoneStatusFrom = new Homey.FlowCardTriggerDevice('zone_' + stype + '_status_from')
            .register()
            .registerRunListener(function(args, state) {
                var trigg = false;
                if (state.current != undefined && Number(args.values) == Number(state.current) && Number(state.value) != Number(state.current)) {
                    trigg = true;
                }
                return Promise.resolve(trigg);
            })

        // Register flow conditions
        this._flowConditionZoneAlarmIs = new Homey.FlowCardCondition('zone_' + stype + '_alarm_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var alarm = spc.getZoneValue(data.panel, data.zone, 'zone_alarm');
                return Promise.resolve(alarm);
            })

        this._flowConditionZoneStateIs = new Homey.FlowCardCondition('zone_' + stype + '_state_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var value = spc.getZoneValue(data.panel, data.zone, 'zone_state_value');
                return Promise.resolve(Number(args.values) == Number(value));
            })

        this._flowConditionZoneStatusIs = new Homey.FlowCardCondition('zone_' + stype + '_status_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var value = spc.getZoneValue(data.panel, data.zone, 'zone_status_value');
                return Promise.resolve(Number(args.values) == Number(value));
            })
    }
    // Flow triggers
    triggerZoneAlarmOn(device, tokens, state) {
        this._flowTriggerZoneAlarmOn
            .trigger(device, tokens, state)
                .then(this.log('triggerZoneAlarmOn'))
                .catch(this.error)
    }

    triggerZoneAlarmOff(device, tokens, state) {
        this._flowTriggerZoneAlarmOff
            .trigger(device, tokens, state)
                .then(this.log('triggerZoneAlarmOff'))
                .catch(this.error)
    }

    triggerZoneStateTo(device, tokens, state) {
        this._flowTriggerZoneStateTo
            .trigger(device, tokens, state)
                .then(this.log('triggerZoneStateTo ', state))
                .catch(this.error)
    }

    triggerZoneStateFrom(device, tokens, state) {
        this._flowTriggerZoneStateFrom
            .trigger(device, tokens, state)
                .then(this.log('triggerZoneStateFrom ', state))
                .catch(this.error)
    }

    triggerZoneStatusTo(device, tokens, state) {
        this._flowTriggerZoneStatusTo
            .trigger(device, tokens, state)
                .then(this.log('triggerZoneStatusTo ', state))
                .catch(this.error)
    }

    triggerZoneStatusFrom(device, tokens, state) {
        this._flowTriggerZoneStatusFrom
            .trigger(device, tokens, state)
                .then(this.log('triggerZoneStatusFrom ', state))
                .catch(this.error)
    }

    // Pairing
    onPair(socket) {
        var self = this;
        spc.debug('Sensor pairing has started...');
        var selectedPanel;

        // Let the front-end know which panels there are
        var panels = spc.getPanels();

        // Make sure the page has fully loaded
        socket.on('loaded', function() {
            socket.emit('start', panels);
        });

        socket.on('selected', function(id, callback) {
            selectedPanel = id;
            callback(null, id);
        });

        socket.on('list_devices', function(data, callback) {
            var devices = spc.getSensors(selectedPanel, self.sensorType());
            callback(null, devices);
        });
    }
}

module.exports = SensorDriver;
