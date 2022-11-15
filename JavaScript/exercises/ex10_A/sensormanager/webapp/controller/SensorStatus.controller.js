sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/strings/formatMessage",
    "sap/m/ValueColor"
  ], function (Controller, formatMessage, ValueColor) {
    "use strict";

    return Controller.extend("keepcool.sensormanager.controller.SensorStatus", {

        formatMessage: formatMessage,

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteSensorStatus").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            this.getView().bindElement({
                path: "/sensors/" + oEvent.getParameter("arguments").index,
                model: "sensorModel"
            });
        },

        navToSensors: function () {
            this.getOwnerComponent().getRouter().navTo("RouteSensors");
        },

        oThreshold: {
            Warm: 4,
            Hot: 5
        },

        formatValueColor: function (iTemperature) {
            if (iTemperature < this.oThreshold.Warm) {
                return ValueColor.Neutral;
            } else if (iTemperature >= this.oThreshold.Warm && iTemperature < this.oThreshold.Hot) {
                return ValueColor.Critical;
            } else {
                return ValueColor.Error;
            }
        }

    });
});