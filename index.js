var Service, Characteristic;
const request = require('request');

const DEF_TIMEOUT = 3000; // 3 seconds
const DEF_INTERVAL = 1000; // 1 second

const URL = "https://www.oref.org.il/WarningMessages/alert/alerts.json";
const HTTP_METHOD = "GET";
const JSON_RESPONSE = "data";
const HEADERS = {
    "Host": "www.oref.org.il",
    "Connection": "close",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Referer": "https://www.oref.org.il/12481-he/Pakar.aspx"
};

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-RedAlert", "RedAlert", HttpMotion);
};

function HttpMotion(log, config) {
   this.log = log;

   // Default fallback configuration if none is provided
   if (!config) {
       this.log("No configuration provided. Using default settings.");
   } else {
       this.log("Using custom configuration")
   }
      
   this.name = config["name"] || "Red Alert Sensor";
   this.url = config["url"] || URL;
   this.http_method = config["http_method"] || HTTP_METHOD;
   this.json_response = config["json_response"] || JSON_RESPONSE;
   this.update_interval = Number(config["update_interval"] || DEF_INTERVAL);
   this.headers = config["headers"] || HEADERS;
   this.targets = config["targets"]; // Configurable target list
   this.manufacturer = "@TM_Industries";
   this.model = "Red_Alerter_5000";
   this.serial = "420-420-420";
   this.timeout = DEF_TIMEOUT;

   // Internal variables
   this.last_state = false;
   this.waiting_response = false;

   this.log(`Fetching Alerts from ${this.url}`)
}

HttpMotion.prototype = {
   updateState: function () {
       // Ensure previous call finished
       if (this.waiting_response) {
           this.log('Avoiding updateState as previous response has not arrived yet');
           return;
       }
       this.waiting_response = true;

       const ops = {
           uri: this.url,
           method: this.http_method,
           timeout: this.timeout,
           headers: this.headers,
       };

      //  this.log(`Requesting motion data from "${ops.uri}" with method ${ops.method}`);
       request(ops, (error, res, body) => {
           let value = false;
           if (error) {
               // Turned off this line so to not flood the Logger
               // this.log(`Your endpoint is not setup or not connected to internet`);
           } else {
               if (body && body.trim()){
                  try {
                     // Can be deleted to reduce log clutter
                     this.log(`HTTP successful response: ${body}`);
                     
                     const response = JSON.parse(body);
                     const dataList = response[this.json_response];


                     // Check if any of the targets are in the data list
                     if (Array.isArray(dataList)) {
                        value = this.targets.some(target => dataList.includes(target));
                        if (value) {
                              this.log(`Detected target(s) in data: ${this.targets}`);
                        }
                     } 
                     else {
                        this.log(`Expected an array in the response, got: ${typeof dataList}`);
                     }
                  }
                  catch (parseErr) {
                     this.log(`Error processing received information: ${parseErr.message}`);
                     }
                  }
               }

           // Update the sensor state
           this.motionService
               .getCharacteristic(Characteristic.MotionDetected)
               .updateValue(value, null, "updateState");
           this.last_state = value;

           this.waiting_response = false;
       });
   },

   getState: function (callback) {
       const state = this.last_state;
       const update = !this.waiting_response;
       this.log(`Call to getState: last_state is "${state}", will update state now: ${update}`);
       if (update) {
           setImmediate(this.updateState.bind(this));
       }
       callback(null, state);
   },

   getServices: function () {
       this.informationService = new Service.AccessoryInformation();
       this.informationService
           .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
           .setCharacteristic(Characteristic.Model, this.model)
           .setCharacteristic(Characteristic.SerialNumber, this.serial);

       this.motionService = new Service.MotionSensor(this.name);
       this.motionService
           .getCharacteristic(Characteristic.MotionDetected)
           .on('get', this.getState.bind(this));

       if (this.update_interval > 0) {
           this.timer = setInterval(this.updateState.bind(this), this.update_interval);
       }

       return [this.informationService, this.motionService];
   },
};