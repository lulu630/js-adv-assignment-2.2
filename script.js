
function saveData(books) {
    localStorage.setItem("books", JSON.stringify(books));

}

function loadData() {
    const data = localStorage.getItem("books");
    return JSON.parse(data) || [];
}

let books = loadData();


// mapping-objects: 
const genreLabels = {
  class: "Classic Literature",
  histFic: "Historical Fiction",
  sciFi: "Science Fiction",
  fant: "Fantasy",
  myst: "Mystery",
  thrill: "Thriller",
  rom: "Romance",
  hor: "Horror",
  bio: "Biography",
  selfHelp: "Self-help",
  psych: "Psychology",
  hist: "History",
  sci: "Science",
  trav: "Travel",
  poet: "Poetry"

}


const langLabels = {
  ara: "Arabic",
  eng: "English",
  nor: "Norwegian",
  rus: "Russian"
}


const statusLabels = {
  read: "✓ Read",
  didNotFinish: "DNF",
  toBeRead: "TBR"
}


const statusBadgeClasses = {
  read: "read-badge",
  didNotFinish: "dnf-badge",
  toBeRead: "tbr-badge"

}


// FUNCTION TO ADD A NEW BOOK
// 1. Get values from the form
// 2. Create a book object
// 3. Add the book to the books array
// 4. Save books to localStorage
// 5. Update stats and render the list
// 6. Reset the form

function addBook() {
    const title = document.getElementById("title").value
    const author = document.getElementById("author").value
    const genre = document.getElementById("genre").value
    const lang = document.getElementById("lang").value
    const startDate = document.getElementById("start-date").value
    const endDate = document.getElementById("end-date").value
    const comment = document.getElementById("comment").value
    const status = document.getElementById("status").value
    const favorite = document.getElementById("favorite").checked

    

    const book = { 
        id: Date.now().toString(), //date.now() to generate a number, toString() turns it to a string
        title, //shorthand for "title: title" (key: value)
        author,
        genre,
        lang,
        startDate, 
        endDate,
        comment,
        status,
        favorite
    }

    books.push(book); //adding a book to the object

    saveData(books); //saving it in localStorage
    showStats()
    applyFilters(); 

    document.querySelector(".reg-form").reset(); //clean up the form

}



// FUNCTION TO SHOW THE BOOK CARDS
function render(booksToRender) {
  
  // make variable for the element with id="book-list"
  const container = document.getElementById("book-list")
  
  // clear everything that was inside that element
  container.textContent = ""

  // go through each book and create elements
  booksToRender.forEach(function(book) {
    const {id, title, author, genre, lang, startDate, endDate, comment, status, favorite} = book

    const card = document.createElement("div")
    card.classList.add("book-card")

    const titleEl = document.createElement("h3")
    titleEl.textContent = title

    const authorEl = document.createElement("p")
    authorEl.textContent = author

    const genreEl = document.createElement("p")
    genreEl.textContent = genreLabels[genre] || genre


    const datesEl = document.createElement("p")
    datesEl.textContent = `${startDate} — ${endDate}`


    const langEl = document.createElement("p")
    langEl.textContent = langLabels[lang] || lang


    const commentEl = document.createElement("p")
    commentEl.textContent = comment


    const statusBadge = document.createElement("span")
    statusBadge.textContent = statusLabels[status] || "TBR"
    statusBadge.classList.add("status-badge", statusBadgeClasses[status] || "tbr-badge")

    const favoriteEl = document.createElement("p")
    favoriteEl.textContent = favorite ? "Favorite" : ""

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")
    deleteBtn.dataset.id = id
    deleteBtn.textContent = "Delete"

    const favBtn = document.createElement("button")
    favBtn.classList.add("fav-btn")
    favBtn.dataset.id = id
    favBtn.textContent = favorite ? "Unfavorite" : "♥ Favorite"

    const favoriteColumn = document.createElement("div")
    favoriteColumn.classList.add("book-favorite-column")

    const titleColumn = document.createElement("div")
    titleColumn.classList.add("book-title-column")

    const infoColumn = document.createElement("div")
    infoColumn.classList.add("book-info-column")

    const commentColumn = document.createElement("div")
    commentColumn.classList.add("book-comment-column")

    const actionsColumn = document.createElement("div")
    actionsColumn.classList.add("book-actions")
    
    
    favoriteEl.textContent = favorite ? "♥" : ""
    favoriteColumn.append(favoriteEl)
    titleColumn.append(titleEl)
    
    infoColumn.append(
    authorEl,
    genreEl,
    datesEl,
    langEl,
    statusBadge
  )


commentColumn.append(commentEl)


actionsColumn.append(deleteBtn, favBtn)


card.append(
  favoriteColumn,
  titleColumn,
  infoColumn,
  commentColumn,
  actionsColumn
)


container.append(card)

})
}


function deleteBook(id) {
  books = books.filter(function(book) {
  return book.id !== id  //keep all books that do not match the id

  })

  saveData(books)
  showStats()
  applyFilters(); 
    
}


function toggleFavorite(id) {
  books = books.map((book) => {
    if (book.id === id) {
      return { ...book, favorite: !book.favorite }

    }
    
    return book

  })

  saveData(books)
  showStats()
  applyFilters()
}


function showStats() {
  const totalRead = books.reduce(function(count, book) {
    if (book.status === "read") {
      return count + 1
    }
    return count
  }, 0)

 
  const stats = document.getElementById("stats")
  stats.textContent = ""

  const p = document.createElement("p")
  p.textContent = `№ BOOKS READ: ${totalRead}`
  
  stats.append(p)

}



// FILTERING
function applyFilters() {
  // read selected value from status, language and genres dropdown
  const statusValue = document.getElementById("filter-status").value
  const langValue = document.getElementById("filter-lang").value
  const genreValue = document.getElementById("filter-genre").value

  // start with the full list of books
  let filtered = [...books]

  // if user selected "favorites", keep only books where favorite is true
  if (statusValue === "favorites") {
    filtered = filtered.filter(function(book) {
      return book.favorite === true
    })
    
  // if user selected something other than "all" keep only books with matching status
  } else if (statusValue !== "all") {
    filtered = filtered.filter(function(book) {
      return book.status === statusValue
    
    })
  }

  if (langValue !== "all") {
  filtered = filtered.filter(function(book) {
    return book.lang === langValue
  })
}

  if(genreValue !== "all") {
    filtered = filtered.filter(function(book) {
      return book.genre === genreValue
    })
}


// SORTING
const sortValue = document.getElementById("sort").value

/*
  sort() compares two books at a time (a & b);
  it expects a number back:
       negative means a comes first,
       positive means b comes first,
       0 means no difference.
  localeCompare() returns exactly these numbers for strings
*/


if (sortValue === "title") {
  filtered.sort((a, b) => a.title.localeCompare(b.title)) 

} else if (sortValue === "author") { 
  filtered.sort((a, b) => a.author.localeCompare(b.author)) //
} else if (sortValue === "newest") {
  filtered.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
} else if (sortValue === "oldest") {
  filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
} else if (sortValue === "fav") {
  filtered.sort((a, b) => b.favorite - a.favorite)
}

/*
favorite is either true (1) or false (0), we want favorite books first, ie (1):
b.favorite - a.favorite:
  b=true, a=false => 1 - 0 = 1 => positive => b comes first
  b=false, a=true => 0 - 1 = -1 => negative => a comes first
so favorite books always endup first.
*/

  render(filtered)
}


document.getElementById("book-list").addEventListener("click", function(e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id
    deleteBook(id)
  }

  if (e.target.classList.contains("fav-btn")) {
  const id = e.target.dataset.id
  toggleFavorite(id)
  }

})


document.querySelector(".reg-form").addEventListener("submit", function (e) {
    e.preventDefault()
    addBook()

})


showStats();
applyFilters();

document.getElementById("filter-status").addEventListener("change", applyFilters)
document.getElementById("filter-lang").addEventListener("change", applyFilters)
document.getElementById("filter-genre").addEventListener("change", applyFilters)
document.getElementById("sort").addEventListener("change", applyFilters)
