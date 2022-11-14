sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IconColor",
    "sap/m/MessageToast"
], function (Controller, IconColor, MessageToast) {
    "use strict";

        return Controller.extend("keepcool.sensormanager.controller.Sensors", {
            onInit: function() {
                if (this.getSensorModel().isA("sap.ui.model.json.JSONModel")){
                    this.getSensorModel().dataLoaded().then(function() {
                        MessageToast.show(
                            this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgSensorDataLoaded"),
                            { closeOnBrowserNavigation: false });
                    }.bind(this));
                }
            },
            getSensorModel: function(){
                return this.getOwnerComponent().getModel("sensorModel");
            },

            oThreshold: {
                Warm: 4,
                Hot: 5
            },

            formatIconColor: function(iTemperature) {
                
                if (iTemperature < this.oThreshold.Warm) {
                    return "#0984e3";
                } else if (iTemperature >= this.oThreshold.Warm && iTemperature < this.oThreshold.Hot) {
                    return IconColor.Critical;
                } else {
                    return IconColor.Negative;
                }
            }
        });
    }
);