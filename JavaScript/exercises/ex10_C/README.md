[![solution](https://flat.badgen.net/badge/solution/available/green?icon=github)](../../../../tree/code/ex11)

# Exercise 10C - Deploy Your App to SAP BTP, Cloud Foundry runtime

In this exercise you'll learn how easy it is to deploy your application directly from SAP Business Application Studio to the SAP BTP, Cloud Foundry runtime.

## Exercise 10C.1 - Create Space in Cloud Foundry

First of all, you need to create the space in your Cloud Foundry environment to host your newly created UI5 application.

1. Open the SAP BTP Trial by opening *https://cockpit.hanatrial.ondemand.com/cockpit/#/home/trial* in a new browser tab and click *Go To Your Trial Account*.
<br><br>![](images/11_01_0010.png)<br><br>

2. You're redirected to your personal SAP BTP Cockpit where your subaccounts are listed. Click on the preferred subaccount, e.g. *trial*.
<br><br>![](images/11_01_0020.png)<br><br>

3. Click the menu item *Cloud Foundry* and then *Spaces*. Until now, no space was created by you. Click *Create Space*.
<br><br>![](images/11_01_0030.png)<br><br>

4. In the popup, enter the space name, e.g. *ui5-apps*. Click *Create*.
<br><br>![](images/11_01_0040.png)<br><br>

5. The newly created space is displayed.
<br><br>![](images/11_01_0050.png)<br><br>

## Exercise 10C.2 - Subscribe to Launchpad Service

To be able to display deployed UI5 applications we need the Launchpad Service in our trial account.
1. To subscribe to it, click on *Service Marketplace* and search the Launchpad Service.
2. Click on the Launchpad Service tile and then on *Create* on the right hand side
<br><br>![](images/11_02_0060.png)<br><br>

3. Leave the selected values as they are and click *Create*
<br><br>![](images/11_02_0070.png)<br><br>

If you now click on *Instance and Subscriptions* you'll see that you have subscribed to the Launchpad Servcice.
## Exercise 10C.3 - Login to Cloud Foundry

Now you can login to your Cloud Foundry environment directly from SAP Business Application Studio.

1. Open SAP Business Application Studio. Click in the header toolbar on *View* and then select *Find Command...*. Enter *CF: Login to cloud foundry*.
<br><br>![](images/11_02_0010.png)<br><br>

Now specify the user credentials:
<br><br>![](images/11_02_0020.png)<br><br>

## Exercise 10C.4 - Set Organization and Space

After logging in you're asked to specify your desired Cloud Foundry organization and space:

<br><br>![](images/11_04_0010.png)<br><br>


## Exercise 10C.5 - Configure Your UI5 Application

Since you created your app using one of the application templates available in SAP Business Application Studio, all files which are located under `sensormanager/test/` and `sensormanager/localService/` are excluded from any build, because in a productive application these files are usually not needed. In our case the sensor data is placed in a local JSON file, so the `sensors.json` file needs to be included in the build.

1. Open `sensormanager/ui5-deploy.yaml`.

2. Remove the `"/localService/**"` entry for the `builder` section.

***sensormanager/ui5-deploy.yaml***

````yaml
builder:
  resources:
    excludes:
      - "/test/**"
````

## Exercise 10C.6 - Build Your Application

Now it's time to build your application. Yeah!

1. Right-click the `mta.yaml` file in the root folder.

2. Select *Build MTA Project*. The build starts.

<br><br>![](images/11_06_0010.png)<br><br>

3. Once the build has finished the terminal will display messages that the MTA archive has been generated and temporary files are cleaned up:

<br><br>![](images/11_06_0020.png)<br><br>


## Exercise 10C.7 - Deploy Your Application

The build step has created a file named `keepcool-sensormanager_0.0.1.mtar` located under `mta_archives`. This file contains your build.

1. Right-click `mta_archives/keepcool-sensormanager_0.0.1.mtar` and select *Deploy MTA Archive*. Deployment starts.
<br><br>![](images/11_07_0010.png)<br><br>

2. You are asked for the organisation and space again. Choose your trial account as organisation and the *ui5-apps* space you just created.

3. Deployment takes some time but should have finished after a few minutes, of which you'll be notified by in the terminal.
<br><br>![](images/11_07_0020.png)<br><br>

4. The deployed application can be started from the SAP BTP Cockpit. Go to your trial subaccount and click on the *HTML5 Applications* section at tjhe left hand side. The application is listed there as 'keepcoolsensormanager'. Click on it to start it.
<br><br>![](images/11_07_0030.png)<br><br>

5. Congratulations! You've deployed your UI5 application to the SAP BTP, Cloud Foundry runtime.
<br><br>![](images/11_07_0040.png)<br><br>

## Summary

Hooray! You've completed successfully [Exercise 10C - Deployment to SAP BTP, Cloud Foundry runtime](../ex10_C/README.md).

Let's take a look at the additional exercises [Additional exercises](../../)
