/* eslint-disable consistent-return, new-cap, no-alert, no-console */

/* Paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render("#paypal-mark");

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder(data, actions) {
      //return actions.order.create(order);
      return fetch("/api/orders", {
        method: "post",
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: "<YOUR_PRODUCT_STOCK_KEEPING_UNIT>",
              quantity: "<YOUR_PRODUCT_QUANTITY>",
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((order) => order.id);
    },
    onApprove(data, actions) {
      fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal(
            "Order Captured!",
            `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
              data.purchase_units[0].payments.captures[0].amount.currency_code
            } ${data.purchase_units[0].payments.captures[0].amount.value}`,
            "success"
          );
        })
        .catch(console.error);
    },
  })
  .render("#paypal-btn");

/* EPS */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.EPS,
  })
  .render("#eps-mark");

paypal
  .PaymentFields({
    fundingSource: paypal.FUNDING.EPS,
    style: {},
    fields: {
      name: {
        value: "",
      },
    },
  })
  .render("#eps-container");

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.EPS,
    style: {
      label: "pay",
    },
    createOrder(data, actions) {
      //return actions.order.create(order);
      return fetch("/api/orders", {
        method: "post",
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: "<YOUR_PRODUCT_STOCK_KEEPING_UNIT>",
              quantity: "<YOUR_PRODUCT_QUANTITY>",
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((order) => order.id);
    },
    onApprove(data, actions) {
      fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal(
            "Order Captured!",
            `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
              data.purchase_units[0].payments.captures[0].amount.currency_code
            } ${data.purchase_units[0].payments.captures[0].amount.value}`,
            "success"
          );
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render("#eps-btn");

document.getElementById("eps-btn").style.display = "none";
document.getElementById("eps-container").style.display = "none";

// Listen for changes to the radio buttons
document.querySelectorAll("input[name=payment-option]").forEach((el) => {
  // handle button toggles
  el.addEventListener("change", (event) => {
    switch (event.target.value) {
      case "paypal":
        document.getElementById("eps-container").style.display = "none";
        document.getElementById("eps-btn").style.display = "none";

        document.getElementById("paypal-btn").style.display = "block";

        break;
      case "eps":
        document.getElementById("eps-container").style.display = "block";
        document.getElementById("eps-btn").style.display = "block";

        document.getElementById("paypal-btn").style.display = "none";
        break;

      default:
        break;
    }
  });
});


