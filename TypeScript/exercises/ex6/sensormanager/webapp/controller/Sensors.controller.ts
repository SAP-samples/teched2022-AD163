import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { IconColor } from "sap/ui/core/library";
import Filter from "sap/ui/model/Filter";
import ListBinding from "sap/ui/model/ListBinding";
import Event from "sap/ui/base/Event";

enum Threshold {
    warm = 4,
    hot = 5
}

/**
 * @namespace keepcool.sensormanager.controller
 */
export default class Sensors extends Controller {

    public onInit(): void {
        const ownerComp = this.getOwnerComponent();
        this.getSensorModel().dataLoaded().then(function() {
            const resourceModel = (ownerComp?.getModel("i18n") as ResourceModel);
            const resourceBundle = (resourceModel.getResourceBundle() as ResourceBundle);
            MessageToast.show(resourceBundle.getText("msgSensorDataLoaded"), { closeOnBrowserNavigation: false });
        }.bind(this)).catch(function(oErr: Error){
            MessageToast.show(oErr.message, { closeOnBrowserNavigation: false });
        });
    }

    public getSensorModel(): JSONModel {
        const ownerComp = this.getOwnerComponent();
        const oModel = (ownerComp?.getModel("sensorModel") as JSONModel);
        return oModel;
    }

    formatIconColor(temperature: number): IconColor {
        if (!Threshold) {
            return IconColor.Neutral;
        } else if (temperature < Threshold.warm) {
            return IconColor.Default;
        } else if (temperature >= Threshold.warm && temperature < Threshold.hot) {
            return IconColor.Critical;
        } else {
            return IconColor.Negative;
        }
    }

    private customFilters: Filter[] = [];
    private statusFilters: Filter[] = [];

    onSensorSelect(event: Event): void {

        const oBinding = this.getView()?.byId("sensorsList")?.getBinding("items");
        const sKey = (event.getParameter("key") as string);

        if (sKey === "Cold") {
            this.statusFilters = [new Filter("temperature", "LT", Threshold.warm, false)];
        } else if (sKey === "Warm") {
            this.statusFilters = [new Filter("temperature", "BT", Threshold.warm, Threshold.hot)];
        } else if (sKey === "Hot") {
            this.statusFilters = [new Filter("temperature", "GT", Threshold.hot, false)];
        } else {
            this.statusFilters = [];
        }

        (oBinding as ListBinding).filter(this.statusFilters);
    }
}