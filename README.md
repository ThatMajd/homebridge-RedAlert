# homebridge-RedAlert

Creates a Red Alert sensor as a motion sensor for homebridge.
For ease of mind the plugin can be setup to work with any endpoint for testing purposes for example by creating an endpoint and hosting it via `localhost`.


### Installation

1. Install homebridge using: ```npm install -g homebridge```
2. Install this plugin using: ```sudo npm install -g git https://github.com/ThatMajd/homebridge-RedAlert.git```
3. Update your configuration file. See sample-config.json in this repository for a sample.

### Configuration

See the sample-config.file to see an example of working accessory. Following, all available options are explained:

The mandatory options are:
 * ```name``` Accessory name.
 * ```targets``` List of locations you want to be alerted about.

Optional:
 * ```update_interval``` If not zero, the field defines the polling period in miliseconds for the sensor state (Default is 1000ms). When the value is zero, the state is only updated when homebridge requests the current value.
 * ```model``` Model name to be displayed.
 * ```serial``` Serial number to be displayed.
 * ```http_method``` Http metod that will be used to call the ```url``` when the state is requested. Default is 'GET' (check request module to get the available options).
 * ```timeout``` Maximum time in miliseconds to wait for the sensor response before fail (Default 3000ms).

### Hosting your own
To run your own **testing** endpoint, run the following: `node broadcast.js`

### Endpoint expectations
Expected output from endpoint:
```
{
  id: "133763117410000000",
  cat: "1",
  title: "ירי רקטות וטילים",
  data: ["מרגליות", "תל חי"],
  desc: "היכנסו למרחב המוגן ושהו בו 10 דקות",
}
```
