const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("66e009ba5149653c94622749")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        "mongodb+srv://oana:Mitricoiu01@cluster0.4esbfu7.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((result) => {
        console.log("Connected to mongo");
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "Oana",
                    email: "oana@oana.com",
                    cart: {
                        items: [],
                    },
                });

                user.save();
            }
        });

        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
