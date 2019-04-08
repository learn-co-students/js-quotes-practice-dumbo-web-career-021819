// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.


// -- loading the content to the dom -- //
//create a variable for the server data to be placed into 
//add the id to the trash button so that we can communicate with the db
const quoteCard = (quote) => {
    return `<li class= 'quote-card' data-id="${quote.id}">
                <blockquote class= "blockquote">
                    <p class = "mb-0">${quote.quote}</p>
                    <footer class= "blockquote-footer">${quote.author}</footer>
                    <br>
                    <button class='btn-success'>Likes:<span>${quote.likes}</span></button>
                    <button class= 'btn-danger' >Delete</button> 
                </blockquote>
            </li>`
}

//find the place that you will be inserting that data into. 
const ulTag = document.querySelector("ul#quote-list")

//fetch the server data and place it into the webpage. MUST TRANSLATE FROM JSON. 

fetch("http://localhost:3000/quotes")
    .then(function(response){
        return response.json() // translating from json
    })
    .then(function(quotes){
       quotes.forEach((quote) => {
            ulTag.innerHTML += quoteCard(quote)
       }) //create the actual quote through iteration. 
    })
    
// --- creating a new quote --- // 
const newFormTag = document.querySelector("form#new-quote-form") //find form 
  
const addNewQuote = (newQuote) => { //created a helper method that will send a POST request
        return fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "Accept": "application/json"
        }, 
        body: JSON.stringify(newQuote) //turns the request into JSON 
        })
        .then(response =>{
            return response.json() //translates the response back to Javascript 
        })
    }

newFormTag.addEventListener("submit",() => { //listen for the submit button to be hit. 
    event.preventDefault() //prevents page refresh 
  
    let newAuthor = event.target.author.value //take the submission for the author
    let newQuote = event.target["new-quote"].value // take the submission for the quote 
    let wholeNewQuote = { //create an object with the values from the submission form. 
        author: newAuthor, 
        quote: newQuote,
        likes: 0
    }  
     
     addNewQuote(wholeNewQuote) //calls on the helper method
    .then ((quote) => { //adds the new data to the DOM 
        ulTag.innerHTML += quoteCard(quote)
    }) 
})

// delete a quote //

// create a helper method that would make a delete request - pass in the id. 
const deleteQuote = (id) => {
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'DELETE'
    })
  }

//create a helper method that would make a PATCH request, pass in the id field and the likeCount 
  const updateLike = (id, likeCount) => {
      fetch (`http:localhost:3000/quotes/${id}`, {
          method: 'PATCH', 
          headers: {
            "Content-Type": "application/json", 
            "Accept": "application/json"
          },
          body: JSON.stringify({likes: likeCount }) //pass in the like count, which will only update this. 
      })
  }

ulTag.addEventListener('click', (event) => { //add an even listener on the buttons
    if (event.target.className === "btn-danger"){ //this specifies the delete button 
        deleteQuote(event.target.parentElement.parentElement.dataset.id) //this is the id that we placed in the template above
        event.target.parentElement.parentElement.remove() //this removes the entire li
        }
    else if (event.target.className === "btn-success"){ //this specifies the like button
        let likes = parseInt(event.target.querySelector("span").innerText); //this turns our likes text into an integer
        likes++; //we increment our integer
       event.target.querySelector("span").innerText = likes; //this updates the likes text on the DOM
        updateLike(event.target.parentElement.parentElement.dataset.id, likes); // this updates the likes text on the DB 
    }
    })

//update the likes //






    