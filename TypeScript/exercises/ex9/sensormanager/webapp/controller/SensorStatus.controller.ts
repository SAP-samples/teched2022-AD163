import Controller from "sap/ui/core/mvc/Controller";
import Event from "sap/ui/base/Event";
import UIComponent from "sap/ui/core/UIComponent";
import formatMessage from "sap/base/strings/formatMessage"
import { ValueColor } from "sap/m/library";
/**
 * @namespace keepcool.sensormanager.controller
 */

 enum Threshold {
    warm = 4,
    hot = 5
}

export default class SensorStatus extends Controller {
    formatMessage = formatMessage;
    public onInit(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().getRoute("RouteSensorStatus")?.attachMatched(this.onRouteMatched, this);
    }
    public onRouteMatched(event: Event): void {
        this.getView()?.bindElement({
            path: "/sensors/" + event.getParameter("arguments").index,
            model: "sensorModel"
        });
    }
    public navToSensors(event: Event): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteSensors")
    }

    formatValueColor(iTemperature: number): ValueColor {
        if (iTemperature < Threshold.warm) {
            return ValueColor.Neutral;
        } else if (iTemperature >= Threshold.warm && iTemperature < Threshold.hot) {
            return ValueColor.Critical;
        } else {
            return ValueColor.Error;
        }
    }
        
}