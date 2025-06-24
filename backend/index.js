const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/", userRoutes);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
