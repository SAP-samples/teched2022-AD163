[![solution](https://flat.badgen.net/badge/solution/available/green?icon=github)](../../../../tree/code/ex7)
[![demo](https://flat.badgen.net/badge/demo/deployed/blue?icon=chrome)](https://SAP-samples.github.io/teched2022-AD163/ex7/sensormanager/webapp/)

# Exercise 7 - Fragment Containing a SelectDialog

Not all the icehouse data might be relevant for every employee of your customer. You should add some kind of basic personalization to the application. You can do this by providing a dialog in which users can select only the icehouse clients relevant for them.

## Exercise 7.1 - Create a new Fragment Definition

A dialog is a perfect scenario in which to use a `sap.ui.core.Fragment`. This UI5 artefact allows you to modularize your code in smaller reusable pieces.

1. Go to folder `sensormanager/webapp/view/`.

2. Right-click on the `view` folder and select `New File`.
<br><br>![](images/07_01_0010.png)<br><br>

3. Enter `CustomerSelectDialog.fragment.xml` as file name.
<br><br>![](images/07_01_0020.png)<br><br>

4. Copy and paste the following content into the newly created `CustomerSelectDialog.fragment.xml`. With that you create a `sap.m.SelectDialog`, which offers functionality to help users select their preferred icehouse clients.

***sensormanager/webapp/view/CustomerSelectDialog.fragment.xml***

````xml
<core:FragmentDefinition
    xmlns="sap.m"
    xmlns:core="sap.ui.core">
    <SelectDialog
        title="{i18n>titleSelectCustomer}"
        contentHeight="38.3%"
        rememberSelections="true"
        items="{
            path: 'sensorModel>/customers',
            sorter: {path:'name'}
        }">
        <StandardListItem title="{sensorModel>name}"/>
    </SelectDialog>
</core:FragmentDefinition>
````

## Exercise 7.2 - Implement the Dialog Opening Logic

After creating the dialog, you need to implement the coding to open the dialog.

1. Open `sensormanager/webapp/controller/Sensors.controller.ts`.

2. Implement the `onCustomerSelect` function to open the dialog. It loads the Fragment and sets the required model and properties.

***sensormanager/webapp/controller/Sensors.controller.ts***

````js
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

                    this.dialog.then(function(oDialog){
                        oDialog.open("");
                    }).catch(function(oErr: Error){
                        MessageToast.show(oErr.message);
                    })
                }

````

## Exercise 7.3 - Add a Dialog Opening Button
After implementing the dialog opening logic, you need to assign this logic to a control.

1. Open `sensormanager/webapp/view/Sensors.view.xml`.

2. Add a new menu button to the page header and bind its `press` event to the newly created `onCustomerSelect` function.

***sensormanager/webapp/view/Sensors.view.xml***

````xml
    <Page id="page" title="{i18n>title}">
        <headerContent>
            <Button icon="sap-icon://menu" press=".onCustomerSelect" tooltip="{i18n>toolTipSelectCustomer}"/>
        </headerContent>
        <content>
        ...
````

3. Switch the browser tab to the application preview and refresh the page to see how the user interface of your application changes. Click the menu button in upper right corner.
<br><br>![](images/07_03_0010.png)<br><br>

## Exercise 7.4 - Implement the 'Filter Customer' Logic

The Dialog contains an input field where the user can search for a customer name.
For this, you need to implement the filter logic.

1. Open `sensormanager/webapp/controller/Sensors.controller.ts`.

2. Add an `onCustomerSelectChange` function with the following content:

***sensormanager/webapp/controller/Sensors.controller.ts***

````js
            onCustomerSelectChange(event: Event): void {
                const sValue = (event.getParameter("value") as string);
                const oFilter = new Filter("name", "Contains", sValue);
                const oBinding = (event.getSource() as Control).getBinding("items");
                (oBinding as ListBinding).filter([oFilter]);
            }

````

## Exercise 7.5 - Implement the 'Select Customer' Logic

After providing an option to select preferred customers, you also need to add the logic to filter the sensors.

1. Open `sensormanager/webapp/controller/Sensors.controller.ts`.

2. Add an `onCustomerSelectConfirm` function with the following content:

***sensormanager/webapp/controller/Sensors.controller.ts***

````js
            onCustomerSelectConfirm(event: Event): void {
                var aSelectedItems = event.getParameter("selectedItems");
                var oBinding = this.getView()?.byId("sensorsList")?.getBinding("items");
                this.customFilters = aSelectedItems.map(function(item: StandardListItem) {
                    return new Filter("customer", "EQ", item.getTitle());
                });
                (oBinding as ListBinding).filter(this.customFilters.concat(this.statusFilters));
            }
````

***sensormanager/webapp/controller/Sensors.controller.ts***

````js
        onSensorSelect(event: Event): void {

            var oBinding = this.getView()?.byId("sensorsList")?.getBinding("items"),
                sKey = event.getParameter("key"),
                oThreshold = this.getSensorModel().getProperty("/threshold");

            if (sKey === "Cold") {
                this.statusFilters = [new Filter("temperature/value", "LT", oThreshold.warm, false)];
            } else if (sKey === "Warm") {
                this.statusFilters = [new Filter("temperature/value", "BT", oThreshold.warm, oThreshold.hot)];
            } else if (sKey === "Hot") {
                this.statusFilters = [new Filter("temperature/value", "GT", oThreshold.hot, false)];
            } else {
                this.statusFilters = [];
            }

            (oBinding as ListBinding).filter(this.statusFilters.concat(this.customFilters));
        }
````

## Exercise 7.6 - Assign the 'Customer Change and Select' Logic to the Dialog

One last thing is missing: You need to assign the newly created functions to the dialog.

1. Open `sensormanager/webapp/view/CustomerSelectDialog.fragment.xml`

2. Add the newly created functions to the `confirm` and `liveChange` events.

***sensormanager/webapp/view/CustomerSelectDialog.fragment.xml***

````xml
    <SelectDialog
        title="{i18n>titleSelectCustomer}"
        contentHeight="38.3%"
        rememberSelections="true"
        confirm=".onCustomerSelectConfirm"
        liveChange=".onCustomerSelectChange"
        items="{
            path: 'sensorModel>/customers',
            sorter: {path:'name'}
        }">
        <StandardListItem title="{sensorModel>name}"/>
    </SelectDialog>
````

3. It's demo time! Switch the browser tab to the application preview and refresh the page to see how the user interface of your UI5 application changes. Select the *menu* button in upper right corner. Enter some parts of customer names and check if the customer list is filtered.
<br><br>![](images/07_06_0010.png)<br><br>

4. Select some preferred customers and click the *Select* button
<br><br>![](images/07_06_0020.png)<br><br>

5. The list of sensors is filtered by both temperature status and preferred customers.
<br><br>![](images/07_06_0030.png)<br><br>

## Summary

Yay! You've successfully completed [Exercise 7 - Fragment containing a SelectDialog](#exercise-7---fragment-containing-a-selectdialog).

Continue to [Exercise 8 - Second View with Navigation](../ex8/README.md).

## Further Information
* (Usage of Fragments in UI5: https://ui5.sap.com/#/topic/d6af195124cf430599530668ddea7425)
* `sap.m.SelectDialog`: https://ui5.sap.com/#/api/sap.m.SelectDialog
