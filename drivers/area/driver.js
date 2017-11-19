"use strict";

// Vanderbilt SPC Area Driver
const Homey = require('homey');
var spc = require('spc-api');

class AreaDriver extends Homey.Driver {
    // Init
    onInit() {
        // Register flow triggers
        this._flowTriggerAreaAlarmOn = new Homey.FlowCardTriggerDevice('area_alarm_on')
            .register()

        this._flowTriggerAreaAlarmOff = new Homey.FlowCardTriggerDevice('area_alarm_off')
            .register()

        this._flowTriggerAreaModeTo = new Homey.FlowCardTriggerDevice('area_mode_to')
            .register()
            .registerRunListener(function(args, state) {
                return Promise.resolve( Number(args.values) === Number(state.value) );
            })

        this._flowTriggerAreaModeFrom = new Homey.FlowCardTriggerDevice('area_mode_from')
            .register()
            .registerRunListener(function(args, state) {
                var trigg = false;
                if (state.current != undefined && Number(args.values) == Number(state.current) && Number(state.value) != Number(state.current)) {
                    trigg = true;
                }
                return Promise.resolve(trigg);
            })

        // Register flow conditions
        this._flowConditionAreaAlarmIs = new Homey.FlowCardCondition('area_alarm_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var alarm = spc.getAreaValue(data.panel, data.area, 'alarm');
                return Promise.resolve(alarm);
            })

        this._flowConditionAreaModeIs = new Homey.FlowCardCondition('area_mode_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var mode = spc.getAreaValue(data.panel, data.area, 'arm_mode_value');
                return Promise.resolve(Number(args.values) == Number(mode));
            })
    }
    // Flow triggers
    triggerAreaAlarmOn(device, tokens, state) {
       this._flowTriggerAreaAlarmOn
            .trigger(device, tokens, state)
                .then(this.log('triggerAreaAlarmOn'))
                .catch(this.error)
    }

    triggerAreaAlarmOff(device, tokens, state) {
       this._flowTriggerAreaAlarmOff
            .trigger(device, tokens, state)
                .then(this.log('triggerAreaAlarmOff'))
                .catch(this.error)
    }

    triggerAreaModeTo(device, tokens, state) {
        this._flowTriggerAreaModeTo
            .trigger(device, tokens, state)
                .then(this.log('triggerAreaModeTo ', state))
                .catch(this.error)
    }

    triggerAreaModeFrom(device, tokens, state) {
        this._flowTriggerAreaModeFrom
            .trigger(device, tokens, state)
                .then(this.log('triggerAreaModeFrom ', state))
                .catch(this.error)
    }

    // Pairing
    onPair(socket) {
        spc.debug('Area pairing has started...');
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

        // this method is run when Homey.emit('list_devices') is run on the front-end
        // which happens when you use the template `list_devices`
        socket.on('list_devices', function(data, callback) {
            var devices = spc.getAreas(selectedPanel);
            // err, result style
            callback(null, devices);
        });
    }
}
module.exports = AreaDriver;
