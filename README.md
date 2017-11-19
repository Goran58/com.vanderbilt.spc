## Homey app for Vanderbilt SPC Intrusion System
This app integrates Homey with Vanderbilt SPC intrusion system. The app allows you to use all your SPC connected motion detectors, door/window contacts, fire detectors and alarm status for control of other devices connected to home, e.g lights, water valves and blinds. It is also support for armiing/disarming the SPC system (if allowed in the SPC configuration).

## Hardware
### Supported panels
in principle all Vanderbilt SPC panels are supported. It is required that the panel supports the IP protocol FlexC, that was introduced in SPC firmware 3.6. 

### SPC Bridge
In order for this application to communicate with the SPC panel, you need a SPC Bridge from Lundix IT, www.lundix.se. SPC Bridge is a network device that converts Vanderbilt FlexC protocol to a REST/Websockets protocol that Homey can use. Please follow the instructions in SPC Bridge User manual to setup and configure the SPC Bridge. 

## Application
### Adding Panel device
First add an Alarm Panel device. The app is restricted to a single Alarm panel. NOTE! It is mandatory that you have a working SPC Bridge before you can add the Alarm Panel device to Homey.

#### SPC Bridge Settings
Specify following settings to be able to communicate with the SPC Bridge:

* SPC Bridge IP and Port. The IP adddress and port number of the SPC Bridge. Default port number is 8088.
* Username and Password Queries (GET). Username and password for queries to SPC Bridge. Default username is get_user and password get_pwd.
* Username and Password Commands(GET). Username and password for commands (e.g. arm/disarm) to SPC Bridge. Default username is put_user and password put_pwd.
* Username and Password Events (WS). Username and password for websockets events from SPC Bridge. Default username is ws_user and password ws_pwd.

#### Panel Information
if communication with the SPC Bridge (and the SPC Panel) was successfully established, a screen with some Panel Information, e.g panel type, model and serial number is shown. The screen is also listing the SPC zones with names and types.

Click the 'Add panel' button to add the Panel device to Homey.

### Adding Alarm Area Devices
After you have added the Panel device you can optionally add a 'virtual' device for each Alarm Area defined in the SPC system. You need to do this if you would like to use area arm modes or/and alarm states as triggers, conditions or actions in Homey Flows.

### adding Alarm Sensor Devices
After you have added the Panel device you can also add a device for each Alarm Zone (input) defined in the SPC system that you would like to use in Homey. You can sort the zones in follwing categories:

* Door Sensor
* Window Sensor
* Motion Sensor
* Smoke Detector

Zones defined in SPC as type 'fire' are only selectable as 'Smoke Detector'. Zones with other zone types can be added either as Door, Window or Motion Sensor.

### Device control and Flows
When it is allowed in the SPC Panel configuration, it is possible to fullset (arm), partset A, partset B or unset (disarm) the panel or area. This can be done either via a Flow, or directly via the device control. Arm modes, alarm states, zone states and status are also possible to use as triggers and conditions in Flows .

NOTE! If you have disabled the arm commands in the SPC panel the command buttons are still clickable in the device control and the corresponding Flow cards are still selectable. But even if it is possible to send the command, the command would be discarded by the SPC system.

#### Panel
The Panel device supports following commands:

* Unset all areas
* Fullset all areas
* Partset A all areas
* Partset B all areas

The device control is showing following arm modes:

* Unset. All areas unset (disaremd)
* Fullset. All areas fullset (armed)
* Partset A. All areas are in mode Partset A.
* Partset B. All areas are in mode Partset B.
* Partly Set. Areas are in different set modes.

The Panel device control also shows if there are any burglary, fire, soak, tamper or trouble alarms in the system.

#### Areas
The Area device supports following commands:

* Unset area
* Fullset area
* Partset A area
* Partset B area

The device control is showing following arm modes:

* Unset. The area is unset (disarmed).
* Fullset. The area is fullset (armed)
* Partset A. The area is in mode Partset A.
* Partset B. The area is in mode Partset B.

The Area device control also shows if there are any burglary, fire, soak, tamper or trouble alarms in the area.

##### Door, window, motion sensors and smoke detectors
The device control for a sensor shows the sensor zone input state, status and alarm state.

Following zone input states are supported:

* Closed
* Open
* Short
* Disconnected
* PIR Masked
* DC Substitution
* Sensor Missing
* Offline

Following zone input status are supported:

* OK
* Inhibit
* Isolate
* Soak
* Tamper
* Alarm
* Trouble

The zone alarm state is true if the input status is Soak, Tamper, Alarm or Trouble.

### Sync with SPC configuration changes
To sync the app with changes you have made in SPC configuration e.g added or removed areas or zones, you need to restart the app. Easist is to do that in the App list on the Settings screen.

### Device Settings
If you select the App in the Settings menu on the Settings screen you will see buttons for Listing Areas, Zones and the SPC systemlog. The information is requested directly from the SPC panel. To be able to use this buttons it is mandatory that you have added the Panel Device at least. 

### Version history
* 1.0.1 First public version
