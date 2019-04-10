"use strict";

/*
Copyright (c) 2016-2017 Ramón Baas - Original author. Thanks for a fantastic work!
Copyright (c) 2017 Goran Lundquist - Total rework for adaption to Vanderbilt SPC and SDK 2.0

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const spc = require('spc-api');
const Homey = require('homey');
//const locale = Homey.ManagerI18n.getLanguage(); 

// Start of the app
class SpcApp extends Homey.App {
    onInit() {
        this.log("Starting Vanderbilt SPC app!");
        spc.setDebug(true);

        // Reset global settings
        Homey.ManagerSettings.unset('spc_bridge_data');
    }
}

module.exports = SpcApp;
