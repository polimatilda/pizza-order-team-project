const pizzasDivElement = document.querySelector(".pizzas");

const pizzaComponent = (name, ingredients, image, price) => `
    <div class="pizza-div">
        <img src="public/img${image}" alt="pizza kepe">
        <input class="pizza-name mod-input" value="${name} pizza" readonly="readonly" />
        <input class="pizza-ingredients mod-input" value="${ingredients}" readonly="readonly" />
        <input class="pizza-price mod-input" value="${price}" readonly="readonly" />
        <button class="switch-stock">&#9741;</button>
        <button class="modify-button">&#9850;</button>
        <button class="remove">&#10005;</button>
    </div>
`;

const fetchPizzas = async () => {
  return fetch("/pizzak")
    .then((res) => res.json())
    .then((pizzas) => pizzas);
};

async function loadEvent() {
  const pizzas = await fetchPizzas();
  console.log(pizzas);
  pizzas.map((pizza) => {
    pizzasDivElement.insertAdjacentHTML(
      "beforeend",
      pizzaComponent(pizza.name, pizza.ingredients, pizza.image, pizza.price)
    );

    if (pizza.isActive === false) {
      const pizzaDivs = document.querySelectorAll(".pizza-div");

      for(let i = 0; i < pizzaDivs.length; i++) {
        if(pizzaDivs[i].querySelector(".pizza-name").value.split(" pizza")[0] === pizza.name) {
          pizzaDivs[i].classList.add("admin-disabled");
          pizzaDivs[i].querySelector(".switch-stock").classList.add("disabled-button");
        }
      }
    }
  });

  //modify input
  let modInp = document.querySelectorAll(".mod-input");
  modInp.forEach(
    (inp) =>
      (inp.ondblclick = (e) => {
        e.target.toggleAttribute("readonly");
      })
  );
  const modifyButton = document.querySelectorAll(".modify-button");

  modifyButton.forEach((button) =>
    button.addEventListener("click", (e) => {
      const parentOfButton = e.target.parentElement;

      console.log(
        parentOfButton.querySelector(".pizza-name").value.split(" pizza")[0]
      );

      const pizzaToModify = parentOfButton
        .querySelector(".pizza-name")
        .value.split(" pizza")[0];
      const modifiedPizza = {
        name: parentOfButton
          .querySelector(".pizza-name")
          .value.split(" pizza")[0],
        ingredients: parentOfButton.querySelector(".pizza-ingredients").value,
        price: parentOfButton.querySelector(".pizza-price").value,
      };

      fetch(`/api/modify-pizza/${pizzaToModify}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedPizza),
      });
    })
  );

  //disable pizza

  const pizzaNames = document.querySelectorAll(".pizza-name");

  const disAbleButtons = document.querySelectorAll(".switch-stock");
  disAbleButtons.forEach((button) =>
    button.addEventListener("click", (event) => {
      //const buttonToDisablePizza = button.innerText.split(" ")[0];
      const parentOfButton = event.target.parentElement;
      const buttonToDisablePizza = parentOfButton
        .querySelector(".pizza-name")
        .value.split(" pizza")[0];

      for (let i = 0; i < pizzaNames.length; i++) {
        if (pizzaNames[i].value.split(" ")[0] === buttonToDisablePizza) {
          const isPizzaAble = {
            name: pizzaNames[i].value.split(" ")[0],
          };

          fetch(`/api/disable-pizza/${buttonToDisablePizza}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(isPizzaAble),
          });

          pizzaNames[i].parentElement.classList.toggle("admin-disabled");
        }
      }

      button.classList.toggle("disabled-button");
    })
  );

  //new pizza
  const sendOrderButton = document.querySelector(".btn-order");
  const formElement = document.querySelector(".form");
  console.log(formElement);
  sendOrderButton.addEventListener("click", () => {
    formElement.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append(
        "image",
        formElement.querySelector('input[name="file"]').files[0]
      );
      formData.append(
        "name",
        formElement.querySelector('textarea[name="name"]').value
      );
      formData.append(
        "ingredients",
        formElement.querySelector('textarea[name="ingredients"]').value
      );
      formData.append(
        "price",
        formElement.querySelector('textarea[name="price"]').value
      );

      fetch(`/new-pizza`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((resJson) =>
          formElement.insertAdjacentHTML(
            "beforebegin",
            pizzaComponent(
              resJson.name,
              resJson.ingredients,
              resJson.image,
              resJson.price
            )
          )
        );
      orderClicked();
    });
  });

  function orderClicked() {
    let cartItems = document.querySelectorAll(".order-item");
    cartItems.forEach((item) => item.remove());
    const inputFields = document.querySelectorAll("textarea");
    inputFields.forEach((item) => (item.value = ""));
    alert("Új ajánlat rögzítve!");
  }

  // delete

  let pizzaDelBtn = document.querySelectorAll(".remove");
  pizzaDelBtn.forEach((delBtn) =>
    delBtn.addEventListener("click", (event) => {
      const toDeletePizzaDiv = event.target.parentElement;
      const pizzaToDelete = toDeletePizzaDiv
        .querySelector(".pizza-name")
        .value.split(" pizza")[0];

      console.log("deleted");
      fetch(`/api/delete-pizza/${pizzaToDelete}`, {
        method: "DELETE",
      }).then(location.reload());
    })
  );
}

window.addEventListener("load", loadEvent);
