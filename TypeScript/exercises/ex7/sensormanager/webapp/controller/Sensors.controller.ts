import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { IconColor } from "sap/ui/core/library";
import Filter from "sap/ui/model/Filter";
import ListBinding from "sap/ui/model/ListBinding";
import Event from "sap/ui/base/Event";
import SelectDialog from "sap/m/SelectDialog";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import StandardListItem from "sap/m/StandardListItem";

enum Threshold {
    Warm = 4,
    Hot = 5
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
        const model = (ownerComp?.getModel("sensorModel") as JSONModel);
        return model;
    }

    formatIconColor(temperature: number): IconColor|string {
        if (temperature < Threshold.Warm) {
            return "#0984e3";
        } else if (temperature >= Threshold.Warm && temperature < Threshold.Hot) {
            return IconColor.Critical;
        } else {
            return IconColor.Negative;
        }
    }

    private customFilters: Filter[] = [];
    private statusFilters: Filter[] = [];

    onSensorSelect(event: Event): void {

        const listBinding = this.getView()?.byId("sensorsList")?.getBinding("items") as ListBinding;
        const key = (event.getParameter("key") as string);

        if (key === "Cold") {
            this.statusFilters = [new Filter("temperature", "LT", Threshold.Warm, false)];
        } else if (key === "Warm") {
            this.statusFilters = [new Filter("temperature", "BT", Threshold.Warm, Threshold.Hot)];
        } else if (key === "Hot") {
            this.statusFilters = [new Filter("temperature", "GT", Threshold.Hot, false)];
        } else {
            this.statusFilters = [];
        }

        listBinding.filter(this.statusFilters.concat(this.customFilters));
    }

    private dialog: Promise<SelectDialog>;

    onCustomerSelect(): void{
        if(!(this.dialog instanceof Promise)) {

            const sensorModel = this.getSensorModel();
            const resourceModel = this.getView()?.getModel("i18n") as ResourceModel;

            this.dialog = Fragment.load({
                type: "XML",
                name: "keepcool.sensormanager.view.CustomerSelectDialog",
                controller: this
            }).then(function(control: Control|Control[]){
                const dialog = (control instanceof Array ? control[0] : control) as SelectDialog;
                dialog.setModel(sensorModel, "sensorModel");
                dialog.setModel(resourceModel, "i18n");
                dialog.setMultiSelect(true);
                return dialog;
            });
        }

        this.dialog.then(function(dialog){
            dialog.open("");
        }).catch(function(err: Error){
            MessageToast.show(err.message);
        });
    }

    onCustomerSelectChange(event: Event): void {
        const value = (event.getParameter("value") as string);
        const filter = new Filter("name", "Contains", value);
        const listBinding = (event.getSource() as Control).getBinding("items") as ListBinding;
        listBinding.filter([filter]);
    }

    onCustomerSelectConfirm(event: Event): void {
        const selectedItems = (event.getParameter("selectedItems") as StandardListItem[]);
        const listBinding = this.getView()?.byId("sensorsList")?.getBinding("items") as ListBinding;
        this.customFilters = selectedItems.map(function(item: StandardListItem) {
            return new Filter("customer", "EQ", item.getTitle());
        });
        listBinding.filter(this.customFilters.concat(this.statusFilters));
    }
}