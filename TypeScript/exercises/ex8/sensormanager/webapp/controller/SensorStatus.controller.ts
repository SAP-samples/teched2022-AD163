import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace keepcool.sensormanager.controller
 */
export default class SensorStatus extends Controller {
    
    public onInit(): void {
        //
    }

    navToSensors(event: Event): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteSensors")
    }
}