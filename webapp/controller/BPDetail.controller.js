sap.ui.define([
        "trainning/bp/controller/BaseController",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    
	function (BaseController, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("trainning.bp.controller.BPDetail", {
			onInit: function () {
                this.attachRoute("ToBPDisplay", this.onRouteMatched);
                this.attachRoute("ToBPEdit", this.onRouteMatched);
                this.attachRoute("ToBPCreate", this.onRouteMatched);
            },
            
            onRouteMatched: function (oEvent) {
                var sRoute = oEvent.getParameter("name");
                var oView = this.getView();

                if (sRoute === "ToBPEdit" || sRoute === "ToBPDisplay") {
                    var sPartnerId = oEvent.getParameter("arguments").PartnerId;

                    oView.bindElement("/BusinessPartnerSet('" + sPartnerId + "')");
                } else if (sRoute === "ToBPCreate") {
                    oView.unbindContext();

                    var oModel = oView.getModel();
                    var oContext = oModel.createEntry("/BusinessPartnerSet", {
                        properties: {
                            PartnerId: "",
                            PartnerType: "",
                            PartnerName1: "",
                            PartnerName2: "",
                            SearchTerm1: "",
                            SearchTerm2: "",
                            Street: "",
                            HouseNumber: "",
                            District: "",
                            City: "",
                            Region: "",
                            ZipCode: "",
                            Country: ""
                        }
                    });

                    oView.setBindingContext(oContext);
                }

                if (sRoute === "ToBPEdit" || sRoute === "ToBPCreate") {
                    this.setEditableControls(true);
                } else {
                    this.setEditableControls(false);
                }

                switch (sRoute) {
                    case "ToBPEdit":
                        this._sOperation = "Edit";
                        break;
                    case "ToBPDisplay":
                        this._sOperation = "Display";
                        break;
                    case "ToBPCreate":
                        this._sOperation = "Create";
                        break;
                }
            },

            setEditableControls: function(bEdit) {
                var oEditModel = new sap.ui.model.json.JSONModel();

                if (bEdit) {
                    oEditModel.loadData(jQuery.sap.getModulePath("trainning.bp", "/model/controlsOpened.json"));
                } else {
                    oEditModel.loadData(jQuery.sap.getModulePath("trainning.bp", "/model/controlsClosed.json"));
                }

                var oView = this.getView();
                oView.setModel(oEditModel, "control");
            },

            onSavePress: function (oEvent) {
                var oView = this.getView();
                var oModel = oView.getModel();
                var that = this;

                switch (this._sOperation) {
                    case "Edit":
                        oModel.submitChanges({
                            success: function (oData, response) {
                                MessageBox.success(that.getText("msgBPUpdated"), {
                                    title: that.getText("txtBPUpdated"),
                                    onClose: function (oAction) {
                                        that.getRouter().navTo("ToBPList");
                                    }
                                });
                            },
                            error: function (oError) {
                                MessageBox.error(that.getText("msgBPUpdError"), {
                                    title: that.getText("txtBPUpdError")
                                });
                            }
                        });

                        break;

                    case "Create":
                        var oObject = oView.getBindingContext().getObject();

                        oModel.create("/BusinessPartnerSet", oObject, {
                            success: function (oData, response) {
                                MessageBox.success(that.getText("msgBPCreated", [oData.PartnerId]), {
                                    title: that.getText("txtBPCreated"),
                                    onClose: function (oAction) {
                                        that.getRouter().navTo("ToBPList");
                                    }
                                });
                            }, error: function (oError) {
                                MessageBox.error(that.getText("msgBPCrtError"), {
                                    title: that.getText("txtBPCrtError")
                                });
                            }
                        });

                        break;
                }
            },

            onCancelPress: function (oEvent) {
                var oView = this.getView();
                var that = this;

                MessageBox.show(that.getText("msgBPCancel"), {
                    title: that.getText("txtBPCancel"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            oView.getModel().resetChanges([oView.getBindingContext().getPath()]);
                            that.getRouter().navTo("ToBPList");
                        }
                    }
                });
            },

            onBackPress: function (oEvent) {
                this.getRouter().navTo("ToBPList");
            },

            openCountryDialog: function (oEvent) {
                if (!this._oCountryDialog) {
                    this._oCountryDialog = new sap.ui.xmlfragment("trainning.bp.fragment.CountryDialog", this);
                    this.getView().addDependent(this._oCountryDialog);
                }

                this._oCountryDialog.open();
            },

            onCloseCountryDialog: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.byId("inputCountry");

                if (oSelectedItem) {
                    oInput.setValue(oSelectedItem.getDescription());
                    oInput.setDescription(oSelectedItem.getTitle());
                } else {
                    oInput.resetProperty("value");
                    oInput.resetProperty("description");
                }
            },

            onSearchCountryDialog: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("LandName", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            }
		});
	});
