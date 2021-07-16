
const list = document.getElementById("list");

function generateId() {
    return Math.floor(Math.random() * 10000);
}

function createHTMLChild(itemName, value) {
    return `<li id="${itemName}" class="app-block" onclick="setState('${itemName}')" >
    <span>
    <img class="d-none" id="${itemName}icon" src="./success.png" width="28" height="28" style="padding:2px"/>
    ${value}
    </span>
    
    <span class="remove" onclick="removeItem('${itemName}')"></span>
    </li>`;
}


function add() {
    addNew(null, null);
}
function addNew(content, id) {

    const text = content || $("#addText").val();

    if (text === "" || text.match("/^\s+|\s+$/g")) {
        $('.error').toast('show');
        return;
    }

    let index = id || "todo" + (generateId());
    let newChild = createHTMLChild(index, text);
    list.innerHTML = list.innerHTML + " " + newChild;

    $('.success').toast("show");
    $("#addText").val('');

    var todos = localStorage.getItem("todos");

    todos = JSON.parse(todos);

    if (todos == null) {
        todos = {};
    }
    todos[index.toLowerCase()] = {
        content: text.toLowerCase(),
        state: todos[index.toLowerCase()] ? todos[index.toLowerCase()].state : "continued"
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}

function removeItem(itemName) {
    let item = document.getElementById(itemName);

    if (!item) return;
    var todos = localStorage.getItem("todos");

    todos = JSON.parse(todos);

    delete todos[itemName];

    if (Object.keys(todos).length === 0) localStorage.removeItem("todos");
    else
        localStorage.setItem("todos", JSON.stringify(todos));

    let parent = item.parentNode;
    parent.removeChild(item);

}

function setState(itemName) {
    let item = $("#" + itemName);
    let successIcon = $("#" + itemName + "icon");

    var todos = localStorage.getItem("todos");
    todos = JSON.parse(todos);

    if (item.hasClass("checked")) {

        item.removeClass("checked");
        successIcon.addClass("d-none");
        todos[itemName.toLowerCase()].state = "continued";
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    else {

        item.addClass("checked");
        successIcon.removeClass("d-none");

        if (!todos || Object.keys(todos).length === 0) return;

        if (!todos[itemName.toLowerCase()])
            return;

        todos[itemName.toLowerCase()].state = "finished";
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function load() {

    var todos = localStorage.getItem("todos");
    todos = JSON.parse(todos);

    if (!todos) return;

    for (var item in todos) {
        addNew(todos[item].content, item);

        let comp = $("#" + item);
        let successIcon = $("#" + item + "icon");

        if (todos[item].state === "finished") {
            comp.addClass("checked");
            successIcon.removeClass("d-none");
        }
        else {
            comp.removeClass("checked");
            successIcon.addClass("d-none");
        }
    }
};


load();