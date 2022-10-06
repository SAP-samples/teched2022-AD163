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
                warm: 4,
                hot: 5
            },

            formatIconColor: function(iTemperature) {
                
                if (!this.oThreshold) {
                    return IconColor.Neutral;
                } else if (iTemperature < this.oThreshold.warm) {
                    return IconColor.Default;
                } else if (iTemperature >= this.oThreshold.warm && iTemperature < this.oThreshold.hot) {
                    return IconColor.Critical;
                } else {
                    return IconColor.Negative;
                }
            }
        });
    }
);