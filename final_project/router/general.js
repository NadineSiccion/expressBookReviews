const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    let matchedUser = users.filter((pair) => {
      ((pair['username'] == username))
    })

    if (matchedUser.length > 0) {
      res.status(404).json({message:"User already exists"})
    } else {
      users.push({'username': username, 'password': password})
      res.send(`User with username ${username} registered! You may now log in.`)
    }

  } else {
    res.status(404).json({message: "Username or Password is blank."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //second add-on
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4))
  } else {
    res.status(404).json({message: "No available book with that ISBN."})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  console.log("Author request sent. \nauthor: " + author)

  let booksList = Object.entries(books)
  
  let authorBooksList = booksList.filter((pair) => pair[1]['author'] == author)

  if (authorBooksList.length > 0) {
    // turn booksByAuthorList to Object
    function toObject(targetList) {
      let newObject = {}
      targetList.forEach(pair => {
        newObject[pair[0]] = pair[1]
      });
      return newObject
    }

    let authorBooksObj = toObject(authorBooksList)
    console.log(authorBooksObj)

    res.send(JSON.stringify(authorBooksObj, null, 4))
  } else {
    res.send("No available books by author " + author + ".")
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase()
  console.log("Title request sent. \ntitle: " + title)

  let booksList = Object.entries(books)
  
  let titleBooksList = booksList.filter((pair) => pair[1]['title'].toLowerCase() == title)

  if (titleBooksList.length > 0) {
    function toObject(targetList) {
      let newObject = {}
      targetList.forEach(pair => {
        newObject[pair[0]] = pair[1]
      });
      return newObject
    }

    let titleBooksObj = toObject(titleBooksList)
    console.log(titleBooksObj)

    res.send(JSON.stringify(titleBooksObj, null, 4))
  } else {
    res.send("No available books by title " + title + ".")
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  
  if (books[isbn]) {
    if (Object.keys(books[isbn]['reviews']).length > 0) {
      res.send(JSON.stringify(books[isbn]['reviews'], null, 4))
    } else {
      // res.send('No reviews for this book.')
      res.send(JSON.stringify(books[isbn]['reviews'], null, 4))
    }
  } else {
    res.status(404).json({message: "No available book with ISBN " + isbn + "."})
  }
});


module.exports.general = public_users;
