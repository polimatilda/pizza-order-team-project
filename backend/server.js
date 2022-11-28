const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/admin.html`));
});

app.get("/orders-list", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/orders-list.html`));
});

app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.get("/pizzak", (req, res) => {
  fs.readFile(`${__dirname}/data/pizzak.json`, (err, data) => {
    if (err) {
      console.log("hiba: ", err);
      res.status(500).send("hibavan");
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

app.listen(2022, console.log("http://127.0.0.1:2022"));

app.post("/pizza-order", (req, res) => {
  let newOrderData = req.body;
  const orderID = new Date().getTime();

  newOrderData.push({ id: orderID });

  fs.writeFile(
    `${__dirname}/orders/order-${orderID}.json`,
    JSON.stringify(newOrderData, null, 2),
    (err) => {
      if (err) {
        console.log("error", err);
        return res.status(500).send(err);
      } else {
        return res.send({ response: "done" });
      }
    }
  );
});

app.post(`/api/disable-pizza/:name`, (req, res) => {
  const paramName = req.params.name;
  //console.log(paramName);

  fs.readFile(`${__dirname}/data/pizzak.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const pizzaData = JSON.parse(data);

      for (let i = 0; i < pizzaData.length; i++) {
        if (pizzaData[i].name === paramName) {
          if (pizzaData[i].isActive === true) {
            pizzaData[i].isActive = false;
          } else {
            pizzaData[i].isActive = true;
          }
        }
      }

      fs.writeFile(
        `${__dirname}/data/pizzak.json`,
        JSON.stringify(pizzaData, null, 2),
        (err) => {
          if (err) {
            console.log("error", err);
            return res.status(500).send(err);
          } else {
            return res.send({ response: "done" });
          }
        }
      );
    }
  });
});

app.post(`/api/modify-pizza/:name`, (req, res) => {
  const paramName = req.params.name;
  const modifiedPizzaData = req.body;
  //console.log(paramName);

  fs.readFile(`${__dirname}/data/pizzak.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const pizzaData = JSON.parse(data);

      for (let i = 0; i < pizzaData.length; i++) {
        if (pizzaData[i].name === paramName) {
          pizzaData[i].name = modifiedPizzaData.name;
          pizzaData[i].ingredients = modifiedPizzaData.ingredients;
          pizzaData[i].price = modifiedPizzaData.price;
        }
      }

      fs.writeFile(
        `${__dirname}/data/pizzak.json`,
        JSON.stringify(pizzaData, null, 2),
        (err) => {
          if (err) {
            console.log("error", err);
            return res.status(500).send(err);
          } else {
            return res.send({ response: "done" });
          }
        }
      );
    }
  });
});

app.delete("/api/delete-pizza/:name", (req, res) => {
  const paramName = req.params.name;

  fs.readFile(`${__dirname}/data/pizzak.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const dataToDelete = JSON.parse(data).filter(
        (pizza) => pizza.name === paramName
      );
      const pictureUploadPath = `${__dirname}/../frontend/public/img${dataToDelete[0].image}`;
      console.log(pictureUploadPath);
      //console.log(pictureUploadPath)

      if (fs.existsSync(pictureUploadPath)) {
        fs.unlinkSync(pictureUploadPath, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
        });
      }

      const pizzaData = JSON.parse(data).filter(
        (pizza) => pizza.name != paramName
      );
      console.log(pizzaData);

      fs.writeFile(
        `${__dirname}/data/pizzak.json`,
        JSON.stringify(pizzaData, null, 4),
        (error) => {
          if (error) {
            console.log(error);
          } else {
            return;
            //res.send({ response: "done" })
            //res.json(imgData);
          }
        }
      );
    }
  });

  return res.status(200).send("done");
});

//order directory

app.get("/admin-orders", (req, res) => {
  const dirPath = `${__dirname}/orders/`;
  let data = [];
  let counter = 0;

  fs.readdir(dirPath, (err, filenames) => {
    if (err) {
      console.log("hiba: ", err);
      res.status(500).send("hibavan");
    } else {
      filenames.forEach((filename) => {
        fs.readFile(dirPath + filename, "utf-8", (err, content) => {
          if (err) {
            console.log(err);
            res.status(500).send("hibavan");
            return;
          } else {
            //data[filename] = JSON.parse(content);
            data.push(JSON.parse(content));
            counter++;
            if (counter === filenames.length) {
              //console.log(data);
              res.status(200).send(data);
            }
          }
        });
      });
    }
  });
});

//upload new pizza

app.post("/new-pizza", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const newImage = req.files.image;
  const newImageData = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    image: "/" + newImage.name,
    price: req.body.price + " €",
    isActive: true,
  };
  console.log(newImage, newImageData);

  newImage.mv(`${__dirname}/../frontend/public/img/${newImage.name}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.readFile(`${__dirname}/data/pizzak.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let imagesData = JSON.parse(data);
      imagesData.push(newImageData);

      fs.writeFile(
        `${__dirname}/data/pizzak.json`,
        JSON.stringify(imagesData, null, 4),
        (error) => {
          if (error) {
            console.log(error);
          } else {
            return res.json(newImageData);
          }
        }
      );
    }
  });
});
