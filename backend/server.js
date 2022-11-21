const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
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

  fs.writeFile(
    `${__dirname}/data/order-${new Date().getTime()}.json`,
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

app.delete("/api/delete-image/:name", (req, res) => {
  const paramName = req.params.name;

  fs.readFile(`${__dirname}/data/pizzak.json`, (err, data) => {
      if(err) {
          console.log(err)
      } else {
          const dataToDelete = JSON.parse(data).filter(img => img.id ===name);
          const pictureUploadPath = `${__dirname}/../frontend/public/img${dataToDelete[0].url}`;
          //console.log(pictureUploadPath)

          if (fs.existsSync(pictureUploadPath)) {
                fs.unlinkSync(pictureUploadPath, (err) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                  }
                });
              }

          const pizzaData = JSON.parse(data).filter(pizza => pizza.name != paramName);

          fs.writeFile("pizzak.json", JSON.stringify(pizzaData, null, 4), (error) => {
              if(error) {
                  console.log(error);
              } else {
                  return
                  //res.send({ response: "done" })
                  //res.json(imgData);
              };
          });
      };
      
  });

return res.status(200).send("done");
});
