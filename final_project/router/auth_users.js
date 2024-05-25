const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Jimjam", "password":"123"}];

const isValid = (username)=>{ //returns boolean; does user exists in current user list?
  //write code to check is the username is valid
  let matchedUsers = users.filter((pair) => pair['username'] === username)
  if (matchedUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.

  let matchedUsers = users.filter((pair) => {
    console.log( `username: ${pair['username']}; password: ${pair['password']}`)
    console.log(`comparisons: ${pair['username'] == username} and ${pair['password'] == password}`)
    if ((pair['username'] === username) && (pair['password'] === password)) {
      return true;
    } else {
      return false;
    }
  })

  if (matchedUsers.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data: password},"access", {expiresIn: 60 * 60})
      req.session.authorization = {accessToken, username}
      res.send(`User ${req.session.authorization['username']} has successfully logged in!`)
    } else {
      res.status(404).json({message: "Password does not match our credentials for that username."})
    }
  } else {
    res.status(404).json({message: "No valid users match that username."})
  }  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.authorization['username']
  let review = req.body.review
  let isbn = req.params.isbn

  const bookReviews = books[isbn]['reviews']
  console.log("book: ", books[isbn])
  console.log("bookReviews: ", bookReviews)

  if (books[isbn]) {
    // check if bookReviews has the same username
    if (bookReviews[username]) {
      if (bookReviews[username] == review) {
        console.log("book: ", books[isbn])
        console.log("bookReviews: ", bookReviews)
        res.send("That review already exists.")
      } else { // updates review
        bookReviews[username] = review
        console.log("book: ", books[isbn])
        console.log("bookReviews: ", bookReviews)
        res.send(`Your review for ${books[isbn]["title"]} has been updated!`)
      }
    } else {
      bookReviews[username] = review
      console.log("book: ", books[isbn])
      console.log("bookReviews: ", bookReviews)
      res.send(`Your review for ${books[isbn]["title"]} has been added! ${JSON.stringify(books[isbn])}`)
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username']
  const isbn = req.params.isbn

  if (books[isbn]) {

    let bookReviews = books[isbn]["reviews"]
    delete bookReviews[username]
    
    res.send(`Your book review under ${books[isbn]['title']} has been deleted. ${JSON.stringify(books[isbn])}`)
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
