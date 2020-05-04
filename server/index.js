const express = require("express");
const fs = require("fs");
const StreamChat = require("stream-chat").StreamChat;
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const AppleAuth = require("apple-auth");
const config = fs.readFileSync("./config/config.json");

const auth = new AppleAuth(
  config,
  fs.readFileSync("./config/AuthKey.p8").toString(),
  "text"
);

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
  const authCode = req.body.code;

  try {
    const response = await auth.accessToken(authCode);
    const data = jwt.decode(response.id_token);
    const appleId = data.sub;

    const username = appleId.split(".")[1];

    const token = client.createToken(username);

    await client.updateUser({ id: username, name: username }, token);

    await channel.create();

    await channel.addMembers([username, "admin"]);

    res.json({
      status: true,
      token,
      username,
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
