sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IconColor",
    "sap/m/MessageToast",
    "sap/ui/model/Filter"
    ], function (Controller, IconColor, MessageToast, Filter) {
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
            },

            onSensorSelect: function (oEvent) {
                this._aCustomerFilters = [];
                this._aStatusFilters = [];

                var oBinding = this.getView().byId("sensorsList").getBinding("items"),
                    sKey = oEvent.getParameter("key");

                if (sKey === "Cold") {
                    this._aStatusFilters = [new Filter("temperature", "LT", this.oThreshold.Warm, false)];
                } else if (sKey === "Warm") {
                    this._aStatusFilters = [new Filter("temperature", "BT", this.oThreshold.Warm, this.oThreshold.Hot, false)];
                } else if (sKey === "Hot") {
                    this._aStatusFilters = [new Filter("temperature", "GT", this.oThreshold.Hot, false)];
                } else {
                    this._aStatusFilters = [];
                }

                oBinding.filter(this._aStatusFilters);
            }
        });
    }
);