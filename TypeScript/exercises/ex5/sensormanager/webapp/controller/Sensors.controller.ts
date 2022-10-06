import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { IconColor } from "sap/ui/core/library";

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
}