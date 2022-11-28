const orderComponent = (orderId) => `
   <div class="order-list-element id-${orderId}">
     <h1 class="order-title">Megrendelési szám: ${orderId}</h1>
   </div>
 `;

const orderPizzaComponent = (orderPizzaName, orderPizzaAmount) => `
<div class="list-pizza">
  <span class="pizza-order-name">Pizza: ${orderPizzaName}</span>
  <span class="pizza-order-amount"> x ${orderPizzaAmount}</span>
</div>
`;

const orderClientDetails = (
    orderClientName,
    orderClientAddress,
    orderClientPhone,
    orderClientEmail,
    orderClientTotal
) => `
  <p>Név: ${orderClientName}</p>
  <p>Cím: ${orderClientAddress}</p>
  <p>Telefon: ${orderClientPhone}</p>
  <p>Email: ${orderClientEmail}</p>
  <p>Fizetendő: ${orderClientTotal}</p>
  <h2>Rendelés tartalma:</h2>
`;

const fetchPizzaOrders = async () => {
    return fetch("/admin-orders")
        .then((res) => res.json())
        .then((orders) => orders);
};

async function loadEvent() {

    const ordersElement = document.querySelector(".orders");
    console.log(ordersElement);

    const orders = await fetchPizzaOrders();
    console.log(orders);
    orders.map((order) => {
        const orderId = order[order.length - 1].id;
        const clientDetails = order[order.length - 2];

        const pizzaOrders = order.slice(0, -2);

        ordersElement.insertAdjacentHTML("beforeend", orderComponent(orderId));

        const orderDiv = document.querySelector(`.id-${orderId}`);

        orderDiv.insertAdjacentHTML(
            "beforeend",
            orderClientDetails(
                clientDetails.name,
                clientDetails.address,
                clientDetails.phone,
                clientDetails.email,
                clientDetails.total
            )
        );

        pizzaOrders.forEach((pizza) =>
            orderDiv.insertAdjacentHTML(
                "beforeend",
                orderPizzaComponent(pizza.pizzaName, pizza.orderedAmount)
            )
        );
    });

    const refreshOrdersBtn = document.querySelector(".refresh-btn");
    refreshOrdersBtn.addEventListener("click", () => {
        location.reload();
    })

};

window.addEventListener("load", loadEvent);