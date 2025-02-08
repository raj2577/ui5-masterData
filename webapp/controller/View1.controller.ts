import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import FilterType from "sap/ui/model/FilterType";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace masterdetail.controller
 */
export default class View1 extends Controller {
    onListPress(oEvent) {
        let orderId = oEvent.getParameter("listItem").getBindingContext().getProperty("OrderID");

        if (!orderId) {
            console.warn("OrderID not found in binding context");
            return;
        }

        let oFilter = new Filter("OrderID", FilterOperator.EQ, orderId);
        let oTable = this.getView()?.byId("orderTable");
        let splitContainer = this.getSplitContObj();
        if (splitContainer) {
            splitContainer.to(this.createId("orderDetail"));
        } else {
            console.warn("SplitContainer not found.");
        }

        if (oTable) {
            oTable.getBinding("items")?.filter([oFilter], FilterType.Application);
        } else {
            console.warn("Table with ID 'orderTable' not found.");
        }
    }

    onPressOrderDetail(oEvent) {
        let productId = oEvent.getSource().getBindingContext().getProperty("ProductID");

        if (!productId) {
            console.warn("ProductID not found in binding context");
            return;
        }

        let oModel = this.getOwnerComponent()?.getModel();
        if (!oModel) {
            console.error("Model not found in Owner Component.");
            return;
        }

        let that = this;
        oModel.read(`/Products(${productId})`, {
            success: function (oData) {
                let jData = new JSONModel(oData);
                that.getView()?.byId("productForm")?.setModel(jData);

                let splitContainer = that.getSplitContObj();
                if (splitContainer) {
                    splitContainer.to(that.createId("productsDetail"));
                } else {
                    console.warn("SplitContainer not found.");
                }
            },
            error: function (oError) {
                console.error("Error fetching product details:", oError);
            }
        });
    }

    getSplitContObj() {
        return this.getView()?.byId("splitContainer") || this.getView()?.getParent()?.byId("splitContainer");
    }
    onProductBack() {
        let splitContainer = this.getSplitContObj();
        if (splitContainer) {
            splitContainer.backToPage(this.createId("orderDetail"));
        } else {
            console.warn("SplitContainer not found.");
        }
    }

}
