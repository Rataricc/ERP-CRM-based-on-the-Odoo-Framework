import * as ProductScreen from "@point_of_sale/../tests/tours/utils/product_screen_util";
import * as ReceiptScreen from "@point_of_sale/../tests/tours/utils/receipt_screen_util";
import * as Dialog from "@point_of_sale/../tests/tours/utils/dialog_util";
import * as PaymentScreen from "@point_of_sale/../tests/tours/utils/payment_screen_util";
import * as TicketScreen from "@point_of_sale/../tests/tours/utils/ticket_screen_util";
import * as Chrome from "@point_of_sale/../tests/tours/utils/chrome_util";
import * as Utils from "@point_of_sale/../tests/tours/utils/common";
import { registry } from "@web/core/registry";
import { inLeftSide, negateStep } from "@point_of_sale/../tests/tours/utils/common";
import * as Order from "@point_of_sale/../tests/tours/utils/generic_components/order_widget_util";

registry.category("web_tour.tours").add("ChromeTour", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            Chrome.clickMenuButton(),
            Chrome.clickMenuDropdownOption("Cash In/Out"),
            Chrome.fillTextArea(".cash-reason", "MOBT"),
            Dialog.confirm(),
            Chrome.clickMenuButton(),

            // Order 1 is at Product Screen
            ProductScreen.addOrderline("Desk Pad", "1", "2", "2.0"),
            Chrome.clickMenuOption("Orders"),
            TicketScreen.checkStatus("-0001", "Ongoing"),

            // Order 2 is at Payment Screen
            Chrome.createFloatingOrder(),
            ProductScreen.addOrderline("Monitor Stand", "3", "4", "12.0"),
            ProductScreen.clickPayButton(),
            PaymentScreen.isShown(),
            Chrome.clickMenuOption("Orders"),
            TicketScreen.checkStatus("-0002", "Payment"),

            // Order 3 is at Receipt Screen
            Chrome.createFloatingOrder(),
            ProductScreen.addOrderline("Whiteboard Pen", "5", "6", "30.0"),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Bank", true, { remaining: "0.0" }),
            PaymentScreen.validateButtonIsHighlighted(true),
            PaymentScreen.clickValidate(),
            ReceiptScreen.isShown(),
            Chrome.clickMenuOption("Orders"),
            TicketScreen.checkStatus("-0003", "Receipt"),

            // Select order 1, should be at Product Screen
            TicketScreen.selectOrder("-0001"),
            TicketScreen.loadSelectedOrder(),
            ProductScreen.productIsDisplayed("Desk Pad"),
            inLeftSide([
                ...ProductScreen.clickLine("Desk Pad"),
                ...ProductScreen.selectedOrderlineHasDirect("Desk Pad", "1.0", "2.0"),
            ]),

            // Select order 2, should be at Payment Screen
            Chrome.clickMenuOption("Orders"),
            TicketScreen.selectOrder("-0002"),
            TicketScreen.loadSelectedOrder(),
            PaymentScreen.emptyPaymentlines("12.0"),
            PaymentScreen.validateButtonIsHighlighted(false),

            // Select order 3, should be at Receipt Screen
            Chrome.clickMenuOption("Orders"),
            TicketScreen.selectOrder("-0003"),
            TicketScreen.loadSelectedOrder(),
            ReceiptScreen.totalAmountContains("30.0"),

            // Pay order 1, with change
            Chrome.clickMenuOption("Orders"),
            TicketScreen.selectOrder("-0001"),
            TicketScreen.loadSelectedOrder(),
            ProductScreen.isShown(),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Cash"),
            PaymentScreen.enterPaymentLineAmount("Cash", "20", true, { change: "18.0" }),
            PaymentScreen.validateButtonIsHighlighted(true),
            PaymentScreen.clickValidate(),
            ReceiptScreen.totalAmountContains("2.0"),

            // Order 1 now should have Receipt status
            Chrome.clickMenuOption("Orders"),
            TicketScreen.checkStatus("-0001", "Receipt"),

            // Select order 3, should still be at Receipt Screen
            // and the total amount doesn't change.
            TicketScreen.selectOrder("-0003"),
            TicketScreen.loadSelectedOrder(),
            ReceiptScreen.totalAmountContains("30.0"),

            // click next screen on order 3
            // then delete the new empty order
            ReceiptScreen.clickNextOrder(),
            ProductScreen.orderIsEmpty(),
            Chrome.clickMenuOption("Orders"),
            TicketScreen.deleteOrder("-0004"),

            // After deleting order 1 above, order 2 became
            // the 2nd-row order and it has payment status
            TicketScreen.nthRowContains(2, "Payment"),
            TicketScreen.deleteOrder("-0002"),
            Dialog.confirm(),
            Chrome.createFloatingOrder(),

            // Invoice an order
            ProductScreen.addOrderline("Whiteboard Pen", "5", "6"),
            ProductScreen.clickPartnerButton(),
            ProductScreen.clickCustomer("Partner Test 1"),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Bank"),
            PaymentScreen.clickInvoiceButton(),
            PaymentScreen.clickValidate(),
            ReceiptScreen.isShown(),
        ].flat(),
});

registry.category("web_tour.tours").add("OrderModificationAfterValidationError", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickDisplayedProduct("Test Product", true, "1.00"),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Bank", true, { remaining: "0.0" }),
            PaymentScreen.clickValidate(),

            // Dialog showing the error
            Dialog.confirm(),

            PaymentScreen.clickBack(),
            { ...ProductScreen.back(), isActive: ["mobile"] },
            ProductScreen.isShown(),

            // Allow order changes after the error
            ProductScreen.clickDisplayedProduct("Test Product", true, "2.00"),
        ].flat(),
});

registry.category("web_tour.tours").add("SearchMoreCustomer", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickPartnerButton(),
            ProductScreen.inputCustomerSearchbar("1111"),
            Utils.selectButton("Search more"),
            ProductScreen.clickCustomer("BPartner"),
            ProductScreen.isShown(),
        ].flat(),
});

registry.category("web_tour.tours").add("test_tracking_number_closing_session", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickDisplayedProduct("Desk Organizer", true, "1.0"),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Bank"),
            PaymentScreen.clickValidate(),
            ReceiptScreen.clickNextOrder(),
            ProductScreen.isShown(),
            Chrome.clickMenuOption("Close Register"),
            {
                content: `Select button close register`,
                trigger: `button:contains(close register)`,
                run: "click",
                expectUnloadPage: true,
            },
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickDisplayedProduct("Desk Pad", true, "1.0"),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Bank"),
            PaymentScreen.clickValidate(),
        ].flat(),
});

registry.category("web_tour.tours").add("test_zero_decimal_places_currency", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickDisplayedProduct("Test Product", true, "1.00"),
            ProductScreen.clickPayButton(),
            PaymentScreen.clickPaymentMethod("Cash"),
            PaymentScreen.clickValidate(),
            ReceiptScreen.receiptIsThere(),
            ReceiptScreen.totalAmountContains("100"),
        ].flat(),
});

registry.category("web_tour.tours").add("test_limited_categories", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickSubcategory("Parent"),
            ProductScreen.productIsDisplayed("Product 1"),
            ProductScreen.productIsDisplayed("Product 2"),
            ProductScreen.clickSubcategory("Child 1"),
            ProductScreen.productIsDisplayed("Product 1"),
            ProductScreen.productIsDisplayed("Product 2").map(negateStep),
            ProductScreen.clickSubcategory("Child 2"),
            ProductScreen.productIsDisplayed("Product 1").map(negateStep),
            ProductScreen.productIsDisplayed("Product 2"),
        ].flat(),
});

registry.category("web_tour.tours").add("CustomerNoteIsPresentAfterRefresh", {
    steps: () =>
        [
            Chrome.startPoS(),
            Dialog.confirm("Open Register"),
            ProductScreen.clickDisplayedProduct("Desk Organizer", true, "1.0", "5.10"),
            inLeftSide([
                { ...ProductScreen.clickLine("Desk Organizer")[0], isActive: ["mobile"] },
                ...ProductScreen.addCustomerNote("Test customer note"),
                ...Order.hasLine({
                    customerNote: "Test customer note",
                }),
            ]),
            Utils.refresh(),
            inLeftSide([
                { ...ProductScreen.clickLine("Desk Organizer")[0], isActive: ["mobile"] },
                ...Order.hasLine({
                    customerNote: "Test customer note",
                }),
            ]),
        ].flat(),
});
