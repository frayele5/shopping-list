const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filter = document.getElementById("filter");
const formBtn = document.querySelector(".btn");
filterWord = '';
isEditMode = false

// Remove all items when pressing "clear all" button
function onClear() {
    document.querySelectorAll("li").forEach((item) => {
        item.remove()
    })
    // remove all from local storage
    localStorage.removeItem('items')
    checkUI();
}

// When clicking on item there are 2 options : removing the item(clicking the x) or editing it
function onItemClick(e) {
    if(e.target.classList.contains('fa-xmark')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        editItem(e.target)
    }
}

//Remove item from DOM and storage
function removeItem(item) {
    item.remove()
    removeItemFromStorage(item.textContent)
    checkUI();
}

// edit item
function editItem(item) {
    isEditMode = true
    allItems = document.querySelectorAll("li");

    allItems.forEach((item) => {
        item.classList.remove('edit-mode')
    });

    item.classList.add('edit-mode');
    itemInput.value = item.textContent
    formBtn.style.backgroundColor = "green"
    formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Item`
}

// Add items to list
function addItemToList(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    if (newItem === ''){
        alert("Submmiting empty item is not allowed");
        return;
    }

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')

        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        removeItem(itemToEdit)
        isEditMode = false
    }
    else {
        if(isItemExistInLocalStorage(newItem)){
            alert("item already exist in the list");
            return;
        }
    }

    createListItem(newItem);
    addItemToStorage(newItem)
    itemInput.value = '';
}

// Add items to local storage
function addItemToStorage(item) {
    const storageItems = getItemsFromStorage();
    
    storageItems.push(item)
    localStorage.setItem('items', JSON.stringify(storageItems))
}

//remove item from storage
function removeItemFromStorage(itemToRemove) {
    let storageItems = getItemsFromStorage()
    storageItems = storageItems.filter((item) => {
        return item !== itemToRemove;
    });
    localStorage.setItem('items', JSON.stringify(storageItems))
}

// get items from local storage
function getItemsFromStorage() {
    let storageItems;
    if(localStorage.getItem('items') === null) {
        storageItems = []
    }
    else {
        storageItems = JSON.parse(localStorage.getItem('items'))
    }
    return storageItems;
}

// load items from local storage
function loadItemsFromStorage(){
    const storageItems = getItemsFromStorage()
    storageItems.forEach((item) => {
        createListItem(item)
    })
}

// check if item exist in local storage 
function isItemExistInLocalStorage(item) {
    const storageItems = getItemsFromStorage()
    
    return storageItems.includes(item)
}

// check UI - reset when there are no items in the list
function checkUI() {
    const items = document.querySelectorAll('li')
    if(items.length === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }

    isEditMode = false
    formBtn.style.backgroundColor = "black"
    formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`
}

//filter items
function filterItems(e) {
    const filterWord = e.target.value.toLowerCase();
    items = document.querySelectorAll("li")
    
    items.forEach((item) => {
        itemText = item.textContent.toLowerCase()
        if(itemText.includes(filterWord)) {
            item.style.display = "flex";
        }
        else {
            item.style.display = "none";
        }
    })
}

// create elements
function createButton(classes){
    const button = document.createElement('button')
    button.className = classes
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i')
    icon.className = classes
    return icon;
}

function createListItem(newItem) {
    const li = document.createElement('li')

    button = createButton("remove-item btn-link text-red")
    icon = createIcon("fa-solid fa-xmark")

    li.appendChild(document.createTextNode(newItem))
    button.appendChild(icon)
    li.appendChild(button)
     
    itemList.appendChild(li)
    checkUI();
}

// Event listeners
clearBtn.addEventListener('click', onClear);
itemForm.addEventListener("submit", addItemToList);
itemList.addEventListener('click', onItemClick);
filter.addEventListener('input', filterItems)
document.addEventListener('DOMContentLoaded', loadItemsFromStorage)

checkUI();