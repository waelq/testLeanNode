const express = require("express");
const cors = require("cors");
const Place = require("./config");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const snapshot = await Place.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});

app.post("/create", async (req, res) => {
  const data = req.body;
  console.log(data);
  await Place.add({ data });
  res.send({ msg: "Place Added" });
});

app.post("/update", async (req, res) => {
  const id = req.body.id;
  delete req.body.id;
  const data = req.body;
  await Place.doc(id).update(data);
  res.send({ msg: "Updated" });
});

const PORT =3000
app.listen(PORT, () => console.log("Server runnig " +PORT));
