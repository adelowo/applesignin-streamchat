const express = require("express");
const StreamChat = require("stream-chat").StreamChat;
const cors = require("cors");
const dotenv = require("dotenv");

const port = process.env.PORT || 5200;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new StreamChat(process.env.API_KEY, process.env.API_SECRET);

const channel = client.channel("messaging", "applesignin", {
  name: "Apple Signin chat",
  created_by: { id: "admin" },
});

app.post("/auth", async (req, res) => {
  const username = req.body.username;
  if (username === undefined || username === "") {
    res.status(400);
    res.json({
      status: false,
    });
    return;
  }

  const token = client.createToken(username);

  await client.updateUser({ id: username, name: username }, token);

  await channel.create();

  await channel.addMembers([username, "admin"]);

  res.json({
    status: true,
    token,
    username,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
