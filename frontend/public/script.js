const pizzasDivElement = document.querySelector(".pizzas");

const pizzaComponent = (name, ingredients, image, price) => `
    <div class="pizza-div">
        <img src="public/img${image}" alt="pizza kepe">
        <h1 class="pizza-name">${name} pizza</h1>
        <p class="pizza-ingredients">${ingredients}</p>
        <label for="amount">Mennyiség:</label>
        <input type="number" name="amount" id="amount" min="1" value="1">
        <h3 class="pizza-price">${price}</h3>
        <button class="add-to-order">+</button>
    </div>
`;

// fetch('/pizzak')
//     .then(res => res.json())
//     .then(pizzas => pizzas.map((pizza) => pizzasDivElement.insertAdjacentHTML('beforeend', pizzaComponent(pizza.name, pizza.ingredients, pizza.image, pizza.price))))

const fetchPizzas = async () => {
  return fetch("/pizzak")
    .then((res) => res.json())
    .then((pizzas) => pizzas);
};

async function loadEvent() {
  // loader
  // function loader() {
  //   document.querySelector(".loader").classList.add("fade-out");
  // }
  // function fadeOut() {
  //   setInterval(loader, 5000);
  // }
  // window.onload = fadeOut();

  const pizzas = await fetchPizzas();
  console.log(pizzas);
  pizzas.map((pizza) =>
    pizzasDivElement.insertAdjacentHTML(
      "beforeend",
      pizzaComponent(pizza.name, pizza.ingredients, pizza.image, pizza.price)
    )
  );

  const addToOrderButtons = document.querySelectorAll(".add-to-order");
  for (let i = 0; i < addToOrderButtons.length; i++) {
    let button = addToOrderButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  const orderSummary = document.querySelector(".cart-div");

  function addToCartClicked(event) {
    let button = event.target;
    let pizzaItem = button.parentElement;
    let title = pizzaItem.querySelector(".pizza-name").innerText;
    let amount = pizzaItem.querySelector("#amount").value;
    let price = pizzaItem.querySelector(".pizza-price").innerText;
    let cartItemNames = document.querySelectorAll(".pizza-order-name");

    for (let i = 0; i < cartItemNames.length; i++) {
      if (cartItemNames[i].innerText === title) {
        alert("Már a rendeléshez adva!");
        return;
      }
    }
  

    orderSummary.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="order-item">
      <span class="pizza-order-name">${title}</span>
      <span class="pizza-order-amount">${amount}</span>
      <span class="multiply">x</span>
      <span class="pizza-order-price">${price}</span>
      <button class="remove-order">X</button>
      </div>
      `
    );

    updateCartTotal();

    let removeCartItemButtons = document.querySelectorAll(".remove-order");
    for (let i = 0; i < removeCartItemButtons.length; i++) {
      const button = removeCartItemButtons[i];
      button.addEventListener("click", removeCartItem);
    }

    function removeCartItem(e) {
      const buttonClicked = e.target;
      buttonClicked.parentElement.remove();
      updateCartTotal();
    }
  }

    const sendOrderButton = document.querySelector(".btn-order");
    sendOrderButton.addEventListener("click", function (event) {
      event.preventDefault();
      let newOrder = [];
      let pizzaOrders = document.querySelectorAll(".order-item");
      let pizzaNames = document.querySelectorAll(".pizza-order-name");
      let pizzaAmounts = document.querySelectorAll(".pizza-order-amount");
      for (let i = 0; i < pizzaOrders.length; i++) {
        let currentPizzaOrder = {
          pizzaName: `${pizzaNames[i].innerText}`,
          orderedAmount: parseInt(pizzaAmounts[i].innerText),
        };

        newOrder.push(currentPizzaOrder);
      }

      const totalPrice = document.querySelector(".cart-total-price").innerText;
      const clientName = document.querySelector("#order-name").value;
      const clientAddress = document.querySelector("#order-address").value;
      const clientPhone = document.querySelector("#order-phone").value;
      const clientEmail = document.querySelector("#order-email").value;

      let clientDetails = {
        total: totalPrice,
        name: clientName,
        address: clientAddress,
        phone: clientPhone,
        email: clientEmail,
      };

      newOrder.push(clientDetails);

      console.log(newOrder);

      fetch(`/pizza-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
      orderClicked();
    });

    function orderClicked() {
      let cartItems = document.querySelectorAll(".order-item");
      cartItems.forEach(item => item.remove());
      const inputFields = document.querySelectorAll("textarea");
      inputFields.forEach(item => item.value = "");
      updateCartTotal();
      alert("Rendelését rögzítettük! Köszönjük a vásárlást!");
    }

  function updateCartTotal() {
    let total = 0;
    let orderItems = document.querySelectorAll(".order-item");

    for (let i = 0; i < orderItems.length; i++) {
      let priceElement = orderItems[i].querySelector(".pizza-order-price");
      let quantityElement = parseInt(
        orderItems[i].querySelector(".pizza-order-amount").innerText
      );
      let price = parseFloat(priceElement.innerText.replace("€", ""));
      let quantity = quantityElement;
      total = total + price * quantity;
    }

    total = Math.round(total * 100) / 100;

    document.querySelector(".cart-total-price").innerText = total + " €";
  }


  // admin felület

  //delete

  let pizzaDivs = document.querySelectorAll(".pizza-div");
  pizzaDivs.forEach(pizzaDiv => pizzaDiv.insertAdjacentHTML("beforeend", `
  <button class="delete-pizza">Törlés</button>
`)
  );

  let pizzaDelBtn = document.querySelectorAll(".delete-pizza");
  pizzaDelBtn.forEach(delBtn => delBtn.addEventListener("click", (event) => {

    const toDeletePizzaDiv = event.target.parentElement
    const pizzaToDelete = toDeletePizzaDiv.querySelector(".pizza-name").innerText.split(" ")[0];

    fetch(`/api/delete-pizza/${pizzaToDelete}`, {
      method: 'DELETE',
    })
      .then(location.reload())

  }))

  //able, disable

  const rootElement = document.querySelector('#root');
  rootElement.insertAdjacentHTML

  pizzas.map((pizza) =>
    rootElement.insertAdjacentHTML(
      "afterend", `
        <button class="disable-pizza">${pizza.name} pizza aktiválás/deaktiválás<button>
      `
    )
  );

  const pizzaNames = document.querySelectorAll(".pizza-name");
  const disAbleButtons = document.querySelectorAll(".disable-pizza");
  disAbleButtons.forEach(button => button.addEventListener("click", (event) => {

    const buttonToDisablePizza = button.innerText.split(" ")[0];

    for(let i = 0; i < pizzaNames.length; i++){
      if(pizzaNames[i].innerText.split(" ")[0] === buttonToDisablePizza) {
        pizzaNames[i].parentElement.classList.toggle("disabled")
      };
    };

    button.classList.toggle("disabled-button");

  }));

};

window.addEventListener("load", loadEvent);
