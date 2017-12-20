"use strict";

// Vanderbilt SPC Panel Driver

const Homey = require('homey');
const spc = require('spc-api');

class SpcDriver extends Homey.Driver {
    // Init
    onInit() {
        // Register flow triggers
        this._flowTriggerPanelAlarmOn = new Homey.FlowCardTriggerDevice('panel_alarm_on')
            .register()

        this._flowTriggerPanelAlarmOff = new Homey.FlowCardTriggerDevice('panel_alarm_off')
            .register()

        this._flowTriggerPanelModeTo = new Homey.FlowCardTriggerDevice('panel_mode_to')
            .register()
            .registerRunListener(function(args, state) {
                return Promise.resolve( Number(args.values) === Number(state.value) );
            })

        this._flowTriggerPanelModeFrom = new Homey.FlowCardTriggerDevice('panel_mode_from')
            .register()
            .registerRunListener(function(args, state) {
                var trigg = false;
                if (state.current != undefined && Number(args.values) == Number(state.current) && Number(state.value) != Number(state.current)) {
                    trigg = true;
                } 
                return Promise.resolve(trigg);
            })

        // Register flow conditions
        this._flowConditionPanelAlarmIs = new Homey.FlowCardCondition('panel_alarm_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var alarm = spc.getPanelValue(data.id, 'alarm');
                return Promise.resolve(alarm);
            })

        this._flowConditionPanelModeIs = new Homey.FlowCardCondition('panel_mode_is')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var mode = spc.getPanelValue(data.id, 'arm_mode_value');
                return Promise.resolve(Number(args.values) == Number(mode));
            })

        // Register flow actions
        this._flowActionPanelMode = new Homey.FlowCardAction('panel_mode_action')
            .register()
            .registerRunListener(function(args, state) {
                var data = args.device.getData();
                var mode = Number(args.values);
                var command = null;
                if (mode == 0) {
                    command = 'unset';
                } else if (mode == 1) {
                    command = 'set_a';
                } else if (mode == 2) {
                    command = 'set_b';
                } else if (mode == 3) {
                    command = 'set';
                }
                if (command) {
                    spc.setPanelArmMode(data.id, command, function(err, success) {
                        if (err) {
                            return Promise.resolve(false);
                        } else {
                            return Promise.resolve(true);
                        }
                    });
                } else {
                    return Promise.resolve(false);
                }
            })

    }
    // Flow triggers
    triggerPanelAlarmOn(device, tokens, state) {
       this._flowTriggerPanelAlarmOn
            .trigger(device, tokens, state)
                .then(this.log('triggerPanelAlarmOn'))
                .catch(this.error)
    }

    triggerPanelAlarmOff(device, tokens, state) {
       this._flowTriggerPanelAlarmOff
            .trigger(device, tokens, state)
                .then(this.log('triggerPanelAlarmOff'))
                .catch(this.error)
    }

    triggerPanelModeTo(device, tokens, state) {
        this._flowTriggerPanelModeTo
            .trigger(device, tokens, state)
                .then(this.log('triggerPanelModeTo ', state))
                .catch(this.error)
    }

    triggerPanelModeFrom(device, tokens, state) {
        this._flowTriggerPanelModeFrom
            .trigger(device, tokens, state)
                .then(this.log('triggerPanelModeFrom ', state))
                .catch(this.error)
    }

    // Pairing
    onPair(socket) {
        var self = this;
        spc.debug('SPC panel pairing has started...');
        var completed = false;
        var panel_ip = '';

        var panels = spc.getPanels();

        // Make sure the page has fully loaded
        socket.on('loaded', function() {
            socket.emit('start', panels);
        });

        // Search for the SPC Bridge once we received IP address and port
        socket.on('search', function(data, callback) {
            panel_ip = data.bridge_ip + ':' + data.bridge_port;
            // Add default settings
            var err = spc.addPanel(self, null, null, data);
            callback(err, err == null);
        });

        // Fully add panel when successful
        socket.on('completed', function(device, callback) {
            var device_data = device.data;

            // Open websocket connection and get current status
            spc.openWsConnection(device_data.id, function(err, success) {
                if (success) {
                    spc.debug('Pairing completed', device_data);
                    completed = true;
                    spc.stopPanelSearch(true)
                } else {
                    spc.debug('Pairing not completed, closing connection on', panel_ip);
                    spc.stopPanelSearch(false);
                }
                // Let the front-end know we are done
                callback(err, success);
            });
        });

        // Check if the pairing was finished, otherwise remove the panel
        socket.on('disconnect', function() {  // Fired when using the form close button
            if (!completed) {
                spc.stopPanelSearch(false);
            }
        });

        // Notify the front-end if a SPC Bridge has been found
        Homey.on('found', function(data) {
            socket.emit('found', data);
        });

        // Notify the front-end on download/import progress
        Homey.on('download', function(data) {
            socket.emit('download', data);
        });
    }
}

module.exports = SpcDriver;
