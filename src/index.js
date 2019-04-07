document.addEventListener('DOMContentLoaded', function(){
    console.log('DOM loaded!');
    importAllQuotes();
    newQuoteListener();
    // deleteListener();
    // likeListener();
    likeAndDeleteListener();
})

const quoteList = document.getElementById('quote-list');
const newQuoteForm = document.getElementById('new-quote-form')

function importQuote(obj) {
    quoteList.innerHTML += `<li class='quote-card' data-id="${obj.id}">
    <blockquote class="blockquote">
      <p class="mb-0" >${obj.quote}</p>
      <footer class="blockquote-footer">${obj.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${obj.likes}</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-info'>Edit</button>
    </blockquote>
  </li>`
};

const importAllQuotes = () => {
    fetch('http://localhost:3000/quotes')
    .then(promise => promise.json())
    .then(resp => resp.forEach (quoteObj => {
        importQuote(quoteObj)
    }))
}

const newQuoteListener = () => {
    newQuoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newObj = {quote: e.target["new-quote"].value,
            author: e.target.author.value,
            likes: 0
        };
        addQuoteToDB(newObj).then(resp => importQuote(resp));
        e.target["new-quote"].value = '';
        e.target.author.value = ''
    })
}

const addQuoteToDB = (obj) => {
    return fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
  		'Content-Type': 'application/json',
  		'Accept': 'application/json'
  	},
    body: JSON.stringify({
        quote: obj.quote,
        author: obj.author,
        likes: obj.likes
    })
}).then(resp => resp.json())
}

let quoteLi = 0

const likeAndDeleteListener = () => {
    quoteList.addEventListener('click', function(e) {
        switch (e.target.className) {
            case 'btn-danger':
                deleteQuote(e);
            case 'btn-success':
                likeQuote(e);
            case 'btn-info':
                const quoteObj = {
                    quote: e.target.parentElement.querySelector('p').textContent,
                    author: e.target.parentElement.querySelector('footer').textContent
                };
                // console.log(quoteObj);
                quoteLi = e.target.parentElement.parentElement;
                e.target.parentElement.remove();
                quoteLi.innerHTML += updateQuoteForm(quoteObj);
                updateListener();
                console.log(quoteLi)
        }
        // if (e.target.className === 'btn-danger') {
            
        // }else if (e.target.className === 'btn-success') {
        //     likeQuote(e)
        // }else if (e.target.className === 'btn-info') {
        //     console.log('hiii')
        // }
    })
}

const deleteQuote = (e) => {
    // quoteList.addEventListener('click', function(e) {
        // if (e.target.className === 'btn-danger'){
            const parentLi = e.target.parentElement.parentElement
            fetch(`http://localhost:3000/quotes/${parentLi.dataset.id}`, {
                method: 'DELETE'});
            parentLi.remove()
        // }
    // })
}

function likeQuote(e) {
    // quoteList.addEventListener('click', function(e) {
    //     if (e.target.className === 'btn-success') {
            let likesSpan = e.target.querySelector('span')
            let likes = likesSpan.innerText;
            likesSpan.innerText = ++likes;
            let thisLi = e.target.parentElement.parentElement;
            incrementLikesInDB(thisLi.dataset.id, likes)
        }
//     })
// }

function incrementLikesInDB(id, likeCount) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'applicatoin/json'
        },
        body: JSON.stringify({likes: likeCount})
    })
}

const updateQuoteForm = (quoteObj) => {
    return `<form id="update-quote-form">
        <div class="form-group">
            <input type="text" class="form-control" id="new-quote" value="${quoteObj.quote}">
        </div>
        <div class="form-group">
            <input type="text" class="form-control" id="author" value="${quoteObj.author}">
        </div>
        <button type="submit" class="btn btn-info">Update</button>
    </form>`
}

function updateListener() {
    document.getElementById('update-quote-form').addEventListener('submit', function(e) {
        e.preventDefault();
        quoteLi = e;
        const quoteObj = {
            quote: quoteLi.target["new-quote"].value,
            author: quoteLi.target.author.value,
            id: quoteLi.target.id.value
        };
        console.log(quoteObj.target.parentElement)
    })
}