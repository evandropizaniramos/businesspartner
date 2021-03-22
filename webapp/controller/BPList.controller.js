sap.ui.define([
        "trainning/bp/controller/BaseController"
	],
	
	function (BaseController) {
		"use strict";

		return BaseController.extend("trainning.bp.controller.BPList", {
			onInit: function () {
                this.attachRoute("ToBPList", this.onRouteMatched);
            },
            
            onRouteMatched: function () {
                this.getView().getModel().refresh(true, false);
            },

            onDisplayPress: function (oEvent) {
                var oSource = oEvent.getSource();
                var oBindingContext = oSource.getBindingContext();

                this.getRouter().navTo("ToBPDisplay", {
                    PartnerId: oBindingContext.getObject().PartnerId
                });
            },

            onEditPress: function (oEvent) {
                var oSource = oEvent.getSource();
                var oBindingContext = oSource.getBindingContext();

                this.getRouter().navTo("ToBPEdit", {
                    PartnerId: oBindingContext.getObject().PartnerId
                });
            },
            
            onCreatePress: function (oEvent) {
                this.getRouter().navTo("ToBPCreate");
            },

            formatPartnerType: function (sPartnerType) {
                switch (sPartnerType) {
                    case "1":
                        return this.getText("txtOrganization");
                        break;
                    case "2":
                        return this.getText("txtPerson");
                        break;
                    default:
                        return "";
                }
            }
		});
	});
