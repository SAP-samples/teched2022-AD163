sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IconColor",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment"
], function (Controller, IconColor, MessageToast, Filter, Fragment) {
    "use strict"

        return Controller.extend("keepcool.sensormanager.controller.Sensors", {
            onInit: function() {
                this._aCustomerFilters = [];
                this._aStatusFilters = [];
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
                    this._aStatusFilters = [new Filter("temperature", "LT", this.oThreshold.warm, false)];
                } else if (sKey === "Warm") {
                    this._aStatusFilters = [new Filter("temperature", "BT", this.oThreshold.warm, this.oThreshold.hot, false)];
                } else if (sKey === "Hot") {
                    this._aStatusFilters = [new Filter("temperature", "GT", this.oThreshold.hot, false)];
                } else {
                    this._aStatusFilters = [];
                }

                oBinding.filter(this._aStatusFilters);
            },

            onSensorSelect: function (oEvent) {
                var oBinding = this.getView().byId("sensorsList").getBinding("items"),
                    sKey = oEvent.getParameter("key");

                if (sKey === "Cold") {
                    this._aStatusFilters = [new Filter("temperature", "LT", this.oThreshold.warm, false)];
                } else if (sKey === "Warm") {
                    this._aStatusFilters = [new Filter("temperature", "BT", this.oThreshold.warm, this.oThreshold.hot, false)];
                } else if (sKey === "Hot") {
                    this._aStatusFilters = [new Filter("temperature", "GT", this.oThreshold.hot, false)];
                } else {
                    this._aStatusFilters = [];
                }

                oBinding.filter(this._aStatusFilters.concat(this._aCustomerFilters));
            },

            onCustomerSelect: function(){
                if(!this._pDialog) {
                    this._pDialog = Fragment.load({
                        type: "XML",
                        name: "keepcool.sensormanager.view.CustomerSelectDialog",
                        controller: this
                    }).then(function(oDialog){
                        oDialog.setModel(this.getSensorModel(), "sensorModel");
                        oDialog.setModel(this.getView().getModel("i18n"), "i18n");
                        oDialog.setMultiSelect(true);
                        return oDialog;
                    }.bind(this));
                }
                this._pDialog.then(function(oDialog){
                    oDialog.open();
                });
            },

            onCustomerSelectChange: function(oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("name", "Contains", sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            onCustomerSelectConfirm: function(oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems");
                var oBinding = this.getView().byId("sensorsList").getBinding("items");
                this._aCustomerFilters = aSelectedItems.map(function(oItem) {
                    return new Filter("customer", "EQ", oItem.getTitle());
                });
                oBinding.filter(this._aCustomerFilters.concat(this._aStatusFilters));
            },

            navToSensorStatus: function(oEvent) {
                var iSensorIndex = oEvent.getSource().getBindingContext("sensorModel").getProperty("index");
                this.getOwnerComponent().getRouter().navTo("RouteSensorStatus", {index: iSensorIndex});
            },

            formatThermometerColor: function(iTemperature) {
                if (!this.oThreshold) {
                    return "black";
                } else if (iTemperature < this.oThreshold.Warm) {
                    return "#1873B4"; // less obtrusive than the standard "blue"
                } else if (iTemperature >= this.oThreshold.Warm && iTemperature < this.oThreshold.Hot) {
                    return "orange";
                } else {
                    return "red";
                }
            },
        });
    }
);