let library = [];

let book = {
    title: "",
    author: "",
    year: "",
    genre: "",
    status: "",
};

const windowAddBook = document.createElement("article");
windowAddBook.className = "bookAdd";
windowAddBook.innerHTML =
    '<div class="infoAdd"><input type="text" placeholder="Название книги" id="title"/><label><span>Автор: </span><input type="text" id="author"/></label><label><span>Год издания: </span><input type="number" min="0" id="year"/></label><label><span>Жанр: </span><input type="text" id="genre"/></label><div id="statusSelect"><span>Статус:</span><label class="statusChoice">Прочитано<input type="radio" name="status" id="statusTrue"/></label><label class="statusChoice">Не прочитано<input type="radio" name="status" id="statusFalse"/></label></div></div><div class="actionsBook"><button class="cancelBook"><img src="./images/cancel.svg" alt="Отменить" /></button><button class="confirmBook"><img src="./images/confirm.svg" alt="Подтвердить" /></button></div>';

const windowConfirmDeleteAll = document.createElement("div");
windowConfirmDeleteAll.setAttribute("id", "confirmDeleteAll");
windowConfirmDeleteAll.innerHTML =
    '<div><p>Вы уверены что хотите удалить всю библиотеку?</p><div><button id="confirmDeleteAllNo">Нет</button><button id="confirmDeleteAllYes">Да</button></div></div>';

const buttonAddBook = document.querySelector("button#addBook");

const buttonRefresh = document.querySelector("button#refresh");
const buttonDeleteAll = document.querySelector("button#deleteAll");
const buttonSort = document.querySelector("button#sort");
const sectionLibrary = document.querySelector("section#library");
const footerQuantityBooks = document.querySelector("footer#quantityBooks");

let inputTitle;
let inputAuthor;
let inputYear;
let inputGenre;
let inputStatusTrue;
let inputStatusFalse;
let buttonConfirm;
let buttonCancel;
let windowAddBookDelete;
let windowBookActions;
let labelStatusChoice;
let identifiedWindowBook;
let buttonEditBook;
let buttonDeleteBook;
let windowBookDisplay = [];
let windowBookActionsDisplay;
let sortStatus = "";
let wasDelete;
let genres;
let buttonGenre;
const buttonReadIt = document.querySelector("button#readIt");
const buttonNoReadIt = document.querySelector("button#noReadIt");
const buttonResetSort = document.querySelector("button#reset");
const buttonsSort = Array.prototype.slice.call(
    document.querySelectorAll("div#sorting button")
);
const windowGenres = document.querySelector("div#by_genre div div");

window.onload = function () {
    document.body.style.opacity = "1";
    if (localStorage.getItem("library")) {
        library = JSON.parse(localStorage.getItem("library"));
        library.forEach((item, index) => {
            loadLibrary(index);
        });
    }
    quantityBooks();
    addGenresSort();
};

function loadLibrary(index) {
    sectionLibrary.append(windowAddBook);

    function readIt() {
        if (library[index].status == "Прочитано") {
            return "Прочитано";
        } else {
            return "";
        }
    }
    function noReadIt() {
        if (library[index].status == "Не прочитано") {
            return "Не прочитано";
        } else {
            return "";
        }
    }

    document.querySelector("input#title").value = library[index].title;
    document.querySelector("input#author").value = library[index].author;
    document.querySelector("input#year").value = library[index].year;
    document.querySelector("input#genre").value = library[index].genre;
    document.querySelector("input#statusTrue").checked = readIt;
    document.querySelector("input#statusFalse").checked = noReadIt;

    inputTitle = document.querySelector("input#title");
    inputAuthor = document.querySelector("input#author");
    inputYear = document.querySelector("input#year");
    inputGenre = document.querySelector("input#genre");
    inputStatusTrue = document.querySelector("input#statusTrue");
    inputStatusFalse = document.querySelector("input#statusFalse");
    labelStatusChoice = document.querySelectorAll("label.statusChoice");
    buttonConfirm = document.querySelector("button.confirmBook");
    buttonCancel = document.querySelector("button.cancelBook");
    windowAddBookDelete = document.querySelector("article.bookAdd");

    book.title = inputTitle.value;
    book.author = inputAuthor.value;
    book.year = inputYear.value;
    book.genre = inputGenre.value;

    const windowBook = document.createElement("article");
    windowBook.innerHTML = `<div class="info"><h2>${
        book.title
    }</h2><p>Автор: <span>${book.author}</span></p><p>Год издания: <span>${
        book.year
    }</span></p><p>Жанр: <span>${
        book.genre
    }</span></p><p>Статус: <span>${readIt()}${noReadIt()}</span></p></div><div class="actionsBook"><button class="editBook"><img src="./images/edit.svg" alt="Редактировать" /></button><button class="deleteBook"><img src="./images/delete.svg" alt="Удалить книгу"/></button></div>`;
    windowBook.className = "book";

    windowAddBookDelete = document.querySelector("article.bookAdd");
    windowAddBookDelete.remove();

    sectionLibrary.appendChild(windowBook);

    book.title = "";
    book.author = "";
    book.year = "";
    book.genre = "";
    book.status = "";

    buttonEditBook = document.querySelectorAll("button.editBook");
    buttonEditBook.forEach((item, index) => {
        item.onclick = function () {
            editBook(index);
        };
    });

    buttonDeleteBook = document.querySelectorAll("button.deleteBook");
    helpDelete = document.createElement("span");
    helpDelete.setAttribute("id", "helpDelete");
    helpDelete.innerHTML = "Для удаления книги - двойной клик";

    buttonDeleteBook.forEach((item) => {
        item.addEventListener("mouseover", (e) => {
            let x = e.clientX - 193;
            let y = e.clientY + 16;
            sectionLibrary.append(helpDelete);
            helpDelete.style.top = `${y}px`;
            helpDelete.style.left = `${x}px`;
        });
        item.addEventListener("mousemove", (e) => {
            x = e.clientX - 193;
            y = e.clientY + 16;
            helpDelete.style.top = `${y}px`;
            helpDelete.style.left = `${x}px`;
        });
        item.addEventListener("mouseout", () => {
            helpDelete.remove();
        });
    });
    function BackToButtonDeleteBook() {
        buttonDeleteBook = document.querySelectorAll("button.deleteBook");
        buttonDeleteBook.forEach((item, index) => {
            item.ondblclick = () => {
                deleteBook(index);
                helpDelete.remove();
                BackToButtonDeleteBook();
            };
        });
    }
    BackToButtonDeleteBook();
}

function hideWasteButton() {
    if (library.length === 0) {
        buttonSort.style.display = "none";
        buttonDeleteAll.style.display = "none";
    } else {
        buttonSort.style.display = "inline-block";
        buttonDeleteAll.style.display = "inline-block";
    }
}

function quantityBooks() {
    windowBookActionsDisplay = Array.prototype.slice.call(
        document.getElementsByClassName("book")
    );
    windowBookActionsDisplay.forEach((item, index) => {
        if (
            getComputedStyle(windowBookActionsDisplay[index]).display == "flex"
        ) {
            windowBookDisplay.push("");
        }
    });
    footerQuantityBooks.innerHTML = `<p>${windowBookDisplay.length}/${library.length}</p>`;
    windowBookDisplay.splice(0, windowBookDisplay.length);
}

function addBook() {
    sectionLibrary.append(windowAddBook);

    document.querySelector("input#title").value = "";
    document.querySelector("input#author").value = "";
    document.querySelector("input#year").value = "";
    document.querySelector("input#genre").value = "";
    document.querySelector("input#statusTrue").checked = false;
    document.querySelector("input#statusFalse").checked = false;

    inputTitle = document.querySelector("input#title");
    inputAuthor = document.querySelector("input#author");
    inputYear = document.querySelector("input#year");
    inputGenre = document.querySelector("input#genre");
    inputStatusTrue = document.querySelector("input#statusTrue");
    inputStatusFalse = document.querySelector("input#statusFalse");
    labelStatusChoice = document.querySelectorAll("label.statusChoice");
    buttonConfirm = document.querySelector("button.confirmBook");
    buttonCancel = document.querySelector("button.cancelBook");
    windowAddBookDelete = document.querySelector("article.bookAdd");

    inputTitle.addEventListener("input", () => {
        book.title = inputTitle.value;
    });
    inputAuthor.addEventListener("input", () => {
        book.author = inputAuthor.value;
    });
    inputYear.addEventListener("input", () => {
        book.year = inputYear.value;
    });
    inputGenre.addEventListener("input", () => {
        book.genre = inputGenre.value;
    });
    inputStatusTrue.addEventListener("input", () => {
        if (inputStatusTrue.value === "on") {
            book.status = "Прочитано";
        }
    });
    inputStatusFalse.addEventListener("input", () => {
        if (inputStatusFalse.value === "on") {
            book.status = "Не прочитано";
        }
    });

    inputTitle.focus();

    buttonConfirm.onclick = confirmAddBook;

    buttonCancel.onclick = cancelAddBook;

    quantityBooks();
}

function confirmAddBook() {
    const windowBook = document.createElement("article");
    windowBook.innerHTML = `<div class="info"><h2>${book.title}</h2><p>Автор: <span>${book.author}</span></p><p>Год издания: <span>${book.year}</span></p><p>Жанр: <span>${book.genre}</span></p><p>Статус: <span>${book.status}</span></p></div><div class="actionsBook"><button class="editBook"><img src="./images/edit.svg" alt="Редактировать" /></button><button class="deleteBook"><img src="./images/delete.svg" alt="Удалить книгу"/></button></div>`;
    windowBook.className = "book";
    if (
        inputTitle.value &&
        (inputStatusTrue.checked || inputStatusFalse.checked)
    ) {
        library.push(JSON.parse(JSON.stringify(book)));
        localStorage.setItem("library", JSON.stringify(library));

        windowAddBookDelete = document.querySelector("article.bookAdd");
        windowAddBookDelete.remove();

        sectionLibrary.appendChild(windowBook);

        if (sortStatus == "readIt" && book.status == "Не прочитано") {
            windowBook.style.display = "none";
        }

        if (sortStatus == "noReadIt" && book.status == "Прочитано") {
            windowBook.style.display = "none";
        }

        if (
            sortStatus != "" &&
            book.genre != sortStatus &&
            book.genre === "" &&
            sortStatus != "noReadIt" &&
            sortStatus != "readIt"
        ) {
            windowBook.style.display = "none";
        }

        if (sortStatus == "Без жанра" && book.genre != "") {
            windowBook.style.display = "none";
        }

        book.title = "";
        book.author = "";
        book.year = "";
        book.genre = "";
        book.status = "";

        buttonEditBook = document.querySelectorAll("button.editBook");
        buttonEditBook.forEach((item, index) => {
            item.onclick = function () {
                editBook(index);
            };
        });

        buttonDeleteBook = document.querySelectorAll("button.deleteBook");
        helpDelete = document.createElement("span");
        helpDelete.setAttribute("id", "helpDelete");
        helpDelete.innerHTML = "Для удаления книги - двойной клик";

        buttonDeleteBook.forEach((item) => {
            item.addEventListener("mouseover", (e) => {
                let x = e.clientX - 193;
                let y = e.clientY + 16;
                sectionLibrary.append(helpDelete);
                helpDelete.style.top = `${y}px`;
                helpDelete.style.left = `${x}px`;
            });
            item.addEventListener("mousemove", (e) => {
                x = e.clientX - 193;
                y = e.clientY + 16;
                helpDelete.style.top = `${y}px`;
                helpDelete.style.left = `${x}px`;
            });
            item.addEventListener("mouseout", () => {
                helpDelete.remove();
            });
        });
        function BackToButtonDeleteBook() {
            buttonDeleteBook = document.querySelectorAll("button.deleteBook");
            buttonDeleteBook.forEach((item, index) => {
                item.ondblclick = () => {
                    deleteBook(index);
                    helpDelete.remove();
                    BackToButtonDeleteBook();
                };
            });
        }
        wasDelete = false;
        BackToButtonDeleteBook();
        quantityBooks();
        addGenresSort();
    } else if (
        !inputTitle.value &&
        (inputStatusTrue.checked || inputStatusFalse.checked)
    ) {
        inputTitle.animate(
            [
                { transform: "translate(0)" },
                { transform: "translate(15px)" },
                { transform: "translate(-12px)" },
                { transform: "translate(9px)" },
                { transform: "translate(-3px)" },
                { transform: "translate(3px)" },
                { transform: "translate(0px)" },
            ],
            350
        );
    } else if (
        !(inputStatusTrue.checked || inputStatusFalse.checked) &&
        inputTitle.value
    ) {
        for (let i = 0; i < labelStatusChoice.length; i++) {
            labelStatusChoice[i].animate(
                [
                    { transform: "translate(0)" },
                    { transform: "translate(15px)" },
                    { transform: "translate(-12px)" },
                    { transform: "translate(9px)" },
                    { transform: "translate(-3px)" },
                    { transform: "translate(3px)" },
                    { transform: "translate(0px)" },
                ],
                350
            );
        }
    } else {
        inputTitle.animate(
            [
                { transform: "translate(0)" },
                { transform: "translate(15px)" },
                { transform: "translate(-12px)" },
                { transform: "translate(9px)" },
                { transform: "translate(-3px)" },
                { transform: "translate(3px)" },
                { transform: "translate(0px)" },
            ],
            350
        );
        for (let i = 0; i < labelStatusChoice.length; i++) {
            labelStatusChoice[i].animate(
                [
                    { transform: "translate(0)" },
                    { transform: "translate(15px)" },
                    { transform: "translate(-12px)" },
                    { transform: "translate(9px)" },
                    { transform: "translate(-3px)" },
                    { transform: "translate(3px)" },
                    { transform: "translate(0px)" },
                ],
                350
            );
        }
    }
}

function editBook(index) {
    let indexEdit = index;
    if (wasDelete) {
        indexEdit -= 1;
        wasDelete = false;
    }
    if (!document.querySelector("article.bookAdd")) {
        library[indexEdit].edit = true;
        function readIt() {
            if (library[indexEdit].status == "Прочитано") {
                return "checked";
            }
        }
        function noReadIt() {
            if (library[indexEdit].status == "Не прочитано") {
                return "checked";
            }
        }

        identifiedWindowBook = document.querySelector(
            `article.book:nth-of-type(${indexEdit + 1})`
        );

        identifiedWindowBook.className = "bookAdd";
        identifiedWindowBook.innerHTML = `<div class="infoAdd"><input type="text" placeholder="Название книги" value="${
            library[indexEdit].title
        }" id="title"/><label><span>Автор: </span><input type="text" value="${
            library[indexEdit].author
        }" id="author"/></label><label><span>Год издания: </span><input type="number" min="0" value="${
            library[indexEdit].year
        }" id="year"/></label><label><span>Жанр: </span><input type="text" value="${
            library[indexEdit].genre
        }" id="genre"/></label><div id="statusSelect"><span>Статус:</span><label class="statusChoice">Прочитано<input type="radio" name="status" ${readIt()} id="statusTrue"/></label><label class="statusChoice">Не прочитано<input type="radio" name="status" ${noReadIt()} id="statusFalse"/></label></div></div><div class="actionsBook"><button class="cancelBook"><img src="./images/cancel.svg" alt="Отменить" /></button><button class="confirmBook"><img src="./images/confirm.svg" alt="Подтвердить" /></button></div>`;

        book.title = library[indexEdit].title;
        book.author = library[indexEdit].author;
        book.year = library[indexEdit].year;
        book.genre = library[indexEdit].genre;
        book.status = library[indexEdit].status;

        inputTitle = document.querySelector("input#title");
        inputAuthor = document.querySelector("input#author");
        inputYear = document.querySelector("input#year");
        inputGenre = document.querySelector("input#genre");
        inputStatusTrue = document.querySelector("input#statusTrue");
        inputStatusFalse = document.querySelector("input#statusFalse");

        inputTitle.addEventListener("input", () => {
            book.title = inputTitle.value;
        });
        inputAuthor.addEventListener("input", () => {
            book.author = inputAuthor.value;
        });
        inputYear.addEventListener("input", () => {
            book.year = inputYear.value;
        });
        inputGenre.addEventListener("input", () => {
            book.genre = inputGenre.value;
        });
        inputStatusTrue.addEventListener("input", () => {
            if (inputStatusTrue.value === "on") {
                book.status = "Прочитано";
            }
        });
        inputStatusFalse.addEventListener("input", () => {
            if (inputStatusFalse.value === "on") {
                book.status = "Не прочитано";
            }
        });

        buttonConfirm = document.querySelector("button.confirmBook");
        buttonConfirm.onclick = () => {
            confirmEditBook(indexEdit);
        };

        buttonCancel = document.querySelector("button.cancelBook");
        buttonCancel.onclick = () => {
            cancelEditBook(indexEdit);
        };
        inputTitle.focus();
    } else {
        brakeAnimation();
    }
}

function cancelEditBook(index) {
    delete library[index].edit;
    identifiedWindowBook.className = "book";
    identifiedWindowBook.innerHTML = `<div class="info"><h2>${library[index].title}</h2><p>Автор: <span>${library[index].author}</span></p><p>Год издания: <span>${library[index].year}</span></p><p>Жанр: <span>${library[index].genre}</span></p><p>Статус: <span>${library[index].status}</span></p></div><div class="actionsBook"><button class="editBook"><img src="./images/edit.svg" alt="Редактировать" /></button><button class="deleteBook"><img src="./images/delete.svg" alt="Удалить книгу"/></button></div>`;

    book.title = "";
    book.author = "";
    book.year = "";
    book.genre = "";
    book.status = "";

    buttonEditBook = document.querySelectorAll("button.editBook");
    buttonEditBook.forEach((item, index) => {
        item.onclick = function () {
            editBook(index);
        };
    });

    buttonDeleteBook = document.querySelectorAll("button.deleteBook");

    helpDelete = document.createElement("span");
    helpDelete.setAttribute("id", "helpDelete");
    helpDelete.innerHTML = "Для удаления книги - двойной клик";

    buttonDeleteBook.forEach((item) => {
        item.addEventListener("mouseover", (e) => {
            const xS = e.clientX - 193;
            const yS = e.clientY + 16;
            sectionLibrary.append(helpDelete);
            helpDelete.style.top = `${yS}px`;
            helpDelete.style.left = `${xS}px`;
        });
        item.addEventListener("mousemove", (e) => {
            const x = e.clientX - 193;
            const y = e.clientY + 16;
            helpDelete.style.top = `${y}px`;
            helpDelete.style.left = `${x}px`;
        });
        item.addEventListener("mouseout", () => {
            helpDelete.remove();
        });
    });

    function BackToButtonDeleteBook() {
        buttonDeleteBook = document.querySelectorAll("button.deleteBook");
        buttonDeleteBook.forEach((item, index) => {
            item.ondblclick = () => {
                deleteBook(index);
                BackToButtonDeleteBook();
            };
        });
    }
    BackToButtonDeleteBook();
}

function confirmEditBook(index) {
    if (
        inputTitle.value &&
        (inputStatusTrue.checked || inputStatusFalse.checked)
    ) {
        delete library[index].edit;
        library.splice(index, 1, JSON.parse(JSON.stringify(book)));
        localStorage.setItem("library", JSON.stringify(library));
        document.querySelector("input#title").value = "";
        document.querySelector("input#author").value = "";
        document.querySelector("input#year").value = "";
        document.querySelector("input#genre").value = "";
        document.querySelector("input#statusTrue").checked = false;
        document.querySelector("input#statusFalse").checked = false;
        identifiedWindowBook.className = "book";
        identifiedWindowBook.innerHTML = `<div class="info"><h2>${book.title}</h2><p>Автор: <span>${book.author}</span></p><p>Год издания: <span>${book.year}</span></p><p>Жанр: <span>${book.genre}</span></p><p>Статус: <span>${book.status}</span></p></div><div class="actionsBook"><button class="editBook"><img src="./images/edit.svg" alt="Редактировать" /></button><button class="deleteBook"><img src="./images/delete.svg" alt="Удалить книгу"/></button></div>`;

        if (sortStatus == "readIt" && book.status == "Не прочитано") {
            identifiedWindowBook.style.display = "none";
        }

        if (sortStatus == "noReadIt" && book.status == "Прочитано") {
            identifiedWindowBook.style.display = "none";
        }

        if (
            sortStatus != "" &&
            book.genre != sortStatus &&
            book.genre === "" &&
            sortStatus != "noReadIt" &&
            sortStatus != "readIt"
        ) {
            identifiedWindowBook.style.display = "none";
        }

        if (sortStatus == "Без жанра" && book.genre != "") {
            identifiedWindowBook.style.display = "none";
        }

        book.title = "";
        book.author = "";
        book.year = "";
        book.genre = "";
        book.status = "";

        buttonEditBook = document.querySelectorAll("button.editBook");
        buttonEditBook.forEach((item, index) => {
            item.onclick = function () {
                editBook(index);
            };
        });

        buttonDeleteBook = document.querySelectorAll("button.deleteBook");

        helpDelete = document.createElement("span");
        helpDelete.setAttribute("id", "helpDelete");
        helpDelete.innerHTML = "Для удаления книги - двойной клик";

        buttonDeleteBook.forEach((item) => {
            item.addEventListener("mouseover", (e) => {
                const xS = e.clientX - 193;
                const yS = e.clientY + 16;
                sectionLibrary.append(helpDelete);
                helpDelete.style.top = `${yS}px`;
                helpDelete.style.left = `${xS}px`;
            });
            item.addEventListener("mousemove", (e) => {
                const x = e.clientX - 193;
                const y = e.clientY + 16;
                helpDelete.style.top = `${y}px`;
                helpDelete.style.left = `${x}px`;
            });
            item.addEventListener("mouseout", () => {
                helpDelete.remove();
            });
        });

        function BackToButtonDeleteBook() {
            buttonDeleteBook = document.querySelectorAll("button.deleteBook");
            buttonDeleteBook.forEach((item, index) => {
                item.ondblclick = () => {
                    deleteBook(index);
                    index = index - 1;
                    BackToButtonDeleteBook();
                };
            });
        }
        BackToButtonDeleteBook();
        quantityBooks();
        addGenresSort();
    } else if (
        !inputTitle.value &&
        (inputStatusTrue.checked || inputStatusFalse.checked)
    ) {
        inputTitle.animate(
            [
                { transform: "translate(0)" },
                { transform: "translate(15px)" },
                { transform: "translate(-12px)" },
                { transform: "translate(9px)" },
                { transform: "translate(-3px)" },
                { transform: "translate(3px)" },
                { transform: "translate(0px)" },
            ],
            350
        );
    } else if (
        !(inputStatusTrue.checked || inputStatusFalse.checked) &&
        inputTitle.value
    ) {
        for (let i = 0; i < labelStatusChoice.length; i++) {
            labelStatusChoice[i].animate(
                [
                    { transform: "translate(0)" },
                    { transform: "translate(15px)" },
                    { transform: "translate(-12px)" },
                    { transform: "translate(9px)" },
                    { transform: "translate(-3px)" },
                    { transform: "translate(3px)" },
                    { transform: "translate(0px)" },
                ],
                350
            );
        }
    } else {
        inputTitle.animate(
            [
                { transform: "translate(0)" },
                { transform: "translate(15px)" },
                { transform: "translate(-12px)" },
                { transform: "translate(9px)" },
                { transform: "translate(-3px)" },
                { transform: "translate(3px)" },
                { transform: "translate(0px)" },
            ],
            350
        );
        for (let i = 0; i < labelStatusChoice.length; i++) {
            labelStatusChoice[i].animate(
                [
                    { transform: "translate(0)" },
                    { transform: "translate(15px)" },
                    { transform: "translate(-12px)" },
                    { transform: "translate(9px)" },
                    { transform: "translate(-3px)" },
                    { transform: "translate(3px)" },
                    { transform: "translate(0px)" },
                ],
                350
            );
        }
    }
}

function deleteBook(index) {
    library.splice(index, 1);
    localStorage.setItem("library", JSON.stringify(library));
    windowBookActions = document.getElementsByClassName("book");
    windowBookActions[index].remove();
    wasDelete = true;
    quantityBooks();
    addGenresSort();
}

function cancelAddBook() {
    document.querySelector("input#title").value = "";
    document.querySelector("input#author").value = "";
    document.querySelector("input#year").value = "";
    document.querySelector("input#genre").value = "";
    document.querySelector("input#statusTrue").checked = false;
    document.querySelector("input#statusFalse").checked = false;
    windowAddBookDelete.remove();
    book.title = "";
    book.author = "";
    book.year = "";
    book.genre = "";
    book.status = "";
}

function sortingReadIt() {
    sortStatus = "readIt";
    buttonGenre = Array.from(document.querySelectorAll("button.sort"));
    buttonGenre.forEach((item) => {
        item.style.background = null;
    });
    buttonReadIt.style.background = `linear-gradient(
        rgb(221, 181, 73),
        rgb(226, 198, 38),
        rgb(221, 181, 73)
    )`;
    buttonResetSort.style.display = "block";
    windowBookActions = document.getElementsByClassName("book");
    librarySort = library.reduce((acc, item) => {
        if (!(item.edit == true)) {
            acc.push(item);
        }
        return acc;
    }, []);
    librarySort.forEach((item, index) => {
        windowBookActions[index].style.display = null;
        if (librarySort[index].status != "Прочитано") {
            windowBookActions[index].style.display = "none";
        }
    });
    quantityBooks();
}

function sortingNoReadIt() {
    sortStatus = "noReadIt";
    buttonGenre = Array.from(document.querySelectorAll("button.sort"));
    buttonGenre.forEach((item) => {
        item.style.background = null;
    });
    buttonNoReadIt.style.background = `linear-gradient(
        rgb(221, 181, 73),
        rgb(226, 198, 38),
        rgb(221, 181, 73)
    )`;
    buttonResetSort.style.display = "block";
    windowBookActions = document.getElementsByClassName("book");
    librarySort = library.reduce((acc, item) => {
        if (!(item.edit == true)) {
            acc.push(item);
        }
        return acc;
    }, []);
    librarySort.forEach((item, index) => {
        windowBookActions[index].style.display = null;
        if (librarySort[index].status != "Не прочитано") {
            windowBookActions[index].style.display = "none";
        }
    });
    quantityBooks();
}

function addGenresSort() {
    genres = Array.from(
        new Set(
            library.map((book) => {
                return book.genre;
            })
        )
    );
    const innerHTML = genres.reduce((acc, genre) => {
        if (!(genre == "")) {
            return acc + `<button class='sort' id="${genre}">${genre}</button>`;
        } else {
            return (
                acc + '<button class="sort" id="Без жанра">Без жанра</button>'
            );
        }
    }, "");
    windowGenres.innerHTML = innerHTML;
    buttonGenre = Array.from(document.querySelectorAll("button.sort"));
    buttonGenre.forEach((item) => {
        if (item.id == sortStatus)
            item.style.background = `linear-gradient(
        rgb(221, 181, 73),
        rgb(226, 198, 38),
        rgb(221, 181, 73)
    )`;
    });
    genres.forEach((genre) => {
        if (!(genre === "")) {
            buttonGenre = document.getElementById(genre);
            buttonGenre.onclick = () => {
                genreSort(genre);
            };
        } else {
            buttonGenre = document.getElementById("Без жанра");
            buttonGenre.onclick = () => {
                genreSort(genre);
            };
        }
    });
}

function genreSort(genre) {
    buttonGenre = Array.from(document.querySelectorAll("button.sort"));
    buttonGenre.forEach((item) => {
        item.style.background = null;
    });
    if (!(genre === "")) {
        buttonGenre = document.getElementById(genre);
    } else {
        buttonGenre = document.getElementById("Без жанра");
    }
    buttonGenre.style.background = `linear-gradient(
        rgb(221, 181, 73),
        rgb(226, 198, 38),
        rgb(221, 181, 73)
    )`;
    if (!(genre === "")) {
        sortStatus = `${genre}`;
    } else {
        sortStatus = "Без жанра";
    }
    buttonReadIt.style.background = null;
    buttonResetSort.style.display = "block";
    windowBookActions = document.getElementsByClassName("book");
    librarySort = library.reduce((acc, item) => {
        if (!(item.edit == true)) {
            acc.push(item);
        }
        return acc;
    }, []);
    librarySort.forEach((item, index) => {
        windowBookActions[index].style.display = null;
        if (librarySort[index].genre != `${genre}`) {
            windowBookActions[index].style.display = "none";
        }
    });
    quantityBooks();
}

function resetSort() {
    sortStatus = "";
    windowBookActions = document.getElementsByClassName("book");
    librarySort = library.reduce((acc, item) => {
        if (!(item.edit == true)) {
            acc.push(item);
        }
        return acc;
    }, []);
    librarySort.forEach((item, index) => {
        windowBookActions[index].style.display = null;
    });
    buttonsSort.forEach((item, index) => {
        buttonsSort[index].style.background = null;
    });
    buttonResetSort.style.display = null;
    quantityBooks();
}

function deleteAll() {
    document.body.append(windowConfirmDeleteAll);
    const buttonNo = document.querySelector("button#confirmDeleteAllNo");
    const buttonYes = document.querySelector("button#confirmDeleteAllYes");
    const windowDeleteAll = document.querySelector("div#confirmDeleteAll");

    function confirmDeleteAllNo() {
        document.body.removeChild(windowDeleteAll);
    }
    function confirmDeleteAllYes() {
        const articleBooks = document.getElementsByClassName("book");
        while (articleBooks[0]) {
            sectionLibrary.removeChild(articleBooks[0]);
        }
        library = [];
        localStorage.removeItem("library");
        document.body.removeChild(windowDeleteAll);
        footerQuantityBooks.innerHTML = `<p>0/0</p>`;
        addGenresSort();
        resetSort();
    }
    buttonNo.onclick = confirmDeleteAllNo;
    buttonYes.onclick = confirmDeleteAllYes;
}

buttonAddBook.onclick = () => {
    if (!document.querySelector("article.bookAdd")) {
        addBook();
    } else {
        brakeAnimation();
    }
};

function brakeAnimation() {
    document
        .querySelector("article.bookAdd")
        .animate(
            [
                { transform: "translate(0)" },
                { transform: "translate(0, 15px)" },
                { transform: "translate(0, -12px)" },
                { transform: "translate(0, 9px)" },
                { transform: "translate(0, -3px)" },
                { transform: "translate(0, 3px)" },
                { transform: "translate(0px)" },
            ],
            350
        );
}

buttonRefresh.onclick = () => {
    document.location.reload();
};

buttonDeleteAll.onclick = deleteAll;

buttonReadIt.onclick = sortingReadIt;

buttonNoReadIt.onclick = sortingNoReadIt;

buttonResetSort.onclick = resetSort;

setInterval(hideWasteButton, 10);
