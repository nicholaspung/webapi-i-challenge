// implement your API here
const express = require("express");
const db = require("./data/db");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Hello from Express");
});

server.get("/api/users", (req, res) => {
  // returns an array of all the user objects contained in the database

  db.find()
    .then(users => res.status(200).json(users))
    .catch(err =>
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." })
    );
});

server.get("/api/users/:id", (req, res) => {
  // returns the user object with the specified `id`
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

server.post("/api/users", (req, res) => {
  // creates a user using the information sent inside the `request body`
  // error: cancel request, status(400).json({ errorMessage: "Please provide name and bio for the user." })
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(newUser)
    .then(user => {
      const userDocument = { ...newUser, id: user.id };
      res.status(201).json(userDocument);
    })
    .catch(err =>
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      })
    );
});

server.delete("/api/users/:id", (req, res) => {
  // removes the user with the specified `id` and returns the deleted user
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The user could not be removed." })
    );
});

server.put("/api/users/:id", (req, res) => {
  // updates the user with the specified `id` using dta from the `request body`. returns the modified document
  const { id } = req.params;
  const user = req.body;

  if (!id || !user) {
    res
      .status(400)
      .json({ errorMesage: "Please provide name and bio for the user." });
  }

  const updatedUser = {
    ...user,
    id
  };

  db.update(id, user)
    .then(updated => {
      if (updated) {
        res.status(200).json(updatedUser);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does nto exist." });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be modified." })
    );
});

server.listen("5000", () =>
  console.log("Server running on http://localhost:5000")
);
