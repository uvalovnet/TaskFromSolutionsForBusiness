
async function openModalWindow(but) {
    const td = but.parentNode;
    const tr = td.parentNode;
    const id = tr.getElementsByClassName("elementDBId")[0].innerHTML;
    const orderId = id;
    const response = await fetch(`Orders/${id}`, {
        method: 'GET',
    });
    const response2 = await fetch(`OrderItems/${orderId}`, {
        method: 'GET',
    });

    var order = await response.json();
    var orderItems = await response2.json();
    fillModalWindow(order, orderItems);
}
async function buttonCreateOrder() {
    const number = document.getElementById("orderNumberCreate").value;
    const providerId = document.getElementById("providers1").value;
    document.getElementById("orderNumberCreate").value = "";

    let items = [];
    var parent = document.getElementsByClassName('itemAddCreate');
    var i;
    for (i = 0; i < parent.length; i += 1) {
        var child1 = parent[i].getElementsByClassName('shadow p-3 mb-5 bg-light rounded')[0];
        var child2 = child1.getElementsByClassName('row')[0];
        var itemOptionConteiner = child2.getElementsByClassName('col-sm-2');
        var itemOption1 = itemOptionConteiner[0].getElementsByClassName('form-control form-control-lg')[0].value;
        var itemOption2 = itemOptionConteiner[1].getElementsByClassName('form-control form-control-lg')[0].value;
        var itemOption3 = itemOptionConteiner[2].getElementsByClassName('form-control form-control-lg')[0].value;

        items.push(
            OrderItem = {
                Name: itemOption1,
                Quantity: itemOption2,
                Unit: itemOption3
            }
        );

        itemOptionConteiner[0].getElementsByClassName('form-control form-control-lg')[0].value = "";
        itemOptionConteiner[1].getElementsByClassName('form-control form-control-lg')[0].value = "";
        itemOptionConteiner[2].getElementsByClassName('form-control form-control-lg')[0].value = "";
    }
    await createOrder(number, providerId, items);
}
async function buttonUpdateOrder() {
    const id = document.getElementById('orderIdUpdate').innerTextL;
    const number = document.getElementById("orderNumberUpdate").value;
    const date = document.getElementById("orderDateUpdate").value;
    const providerId = document.getElementById("providers3").value;

    let items = [];
    var parent = document.getElementsByClassName('itemUpdate');
    var i;
    for (i = 0; i < parent.length; i += 1) {
        var child1 = parent[i].getElementsByClassName('shadow p-3 mb-5 bg-light rounded')[0];
        var child2 = child1.getElementsByClassName('row')[0];

        var itemIdConteiner = child2.getElementsByClassName('col-sm-1');
        var itemId = parseInt(itemIdConteiner.innerText);

        var itemOptionConteiner = child2.getElementsByClassName('col-sm-3');
        var itemOption1 = itemOptionConteiner[0].getElementsByClassName('form-control form-control-lg')[0].value;
        var itemOption2 = itemOptionConteiner[1].getElementsByClassName('form-control form-control-lg')[0].value;
        var itemOption3 = itemOptionConteiner[2].getElementsByClassName('form-control form-control-lg')[0].value;

        if (itemId) {
            items.push(
                OrderItem = {
                    Id: itemId,
                    Name: itemOption1,
                    Quantity: itemOption2,
                    Unit: itemOption3
                }
            );
        }
        else {
            items.push(
                OrderItem = {
                    Id: -1,
                    Name: itemOption1,
                    Quantity: itemOption2,
                    Unit: itemOption3
                }
            );
        } 
    }
    await orderUpdate(id, number, date, providerId, items);
}
async function createOrder(orderNumber, providerId, items) {

    const response = await fetch("Orders/Create", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            Number: orderNumber,
            ProviderId: providerId,
            listItems: items,
        })
    });
    getAllOrdersData();
}
async function deleteOrder(but) {
    const td = but.parentNode;
    const tr = td.parentNode;
    const id = tr.getElementsByClassName("elementDBId")[0].innerHTML;
    const response = await fetch(`Orders/Delete/${id}`, {
        method: 'DELETE',
    });
    getAllOrdersData();
}
async function orderUpdate(id, number, date, providerId, items) {
    const response = await fetch("Orders/Update", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            Id: id,
            Number: number,
            Date: date,
            ProviderId: providerId,
            listItems: items,
        })
    });
    getAllOrdersData();
}
async function deleteItem(x) {
    const itemOptionDiv = x.parentNode;
    const div3 = itemOptionDiv.parentNode;
    const div2 = div3.parentNode;
    const div1 = div2.parentNode;
    const parent = div1.parentNode;
    parent.removeChild(div1);
}
async function deleteItemUpdate(but) {
    const colsm = but.parentNode;
    const row = colsm.parentNode;
    const shadow = row.parentNode;
    const itemUpdate = shadow.parentNode;
    const form = itemUpdate.parentNode;
    const id = parseInt(row.innerText);
    const response = await fetch(`OrderItems/Delete/${id}`, {
        method: 'DELETE',
    });
    form.removeChild(itemUpdate);
}



async function getFilteredOrdersData(start, end,
    providerId, orderNumber, orderItemName, orderItemUnit) {
    params = "";
    if (start != "") { params += "&start=" + start }
    if (end != "") { params += "&end=" + end }
    if (providerId != -1) { params += "&providerId=" + providerId }
    if (orderNumber != "") { params += "&orderNumber=" + orderNumber }
    if (orderItemName != "") { params += "&orderItemName=" + orderItemName }
    if (orderItemUnit != "") { params += "&orderItemUnit=" + orderItemUnit }

    const response = await fetch("/Orders/Filtered?" + params, {
        method: "GET",
    });
    if (response.ok === true) {
        const items = await response.json();
        fillTable(items);
    }
}
async function getAllOrdersData() {
    const response = await fetch("/Orders", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const items = await response.json();
        fillTable(items);
    }
}
async function getProvidersForSelectors() {
    const response = await fetch("/Providers", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const items = await response.json();
        fillSelectors(items);
    }
}



async function fillTable(items) {
    var parentElement = document.getElementById('viewTable');

    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }


    if (items.length > 0) {
        
        const thead = document.createElement("thead");
        const tr1 = document.createElement("tr");
        const thId = document.createElement("th");
        const thNumber = document.createElement("th");
        const thDate = document.createElement("th");
        const thProvider = document.createElement("th");
        const thActions = document.createElement("th");

        thId.innerHTML = "Id";
        thNumber.innerHTML = "Number";
        thDate.innerHTML = "Date";
        thProvider.innerHTML = "Provider";
        thActions.innerHTML = "Actions";

        tr1.append(thId);
        tr1.append(thNumber);
        tr1.append(thDate);
        tr1.append(thProvider);
        tr1.append(thActions);
        thead.append(tr1);

        const tbody = document.createElement("tbody");
        for (let i = 0; i < items.length; i++) {
            tr2 = document.createElement("tr");
            tdId = document.createElement("td");
            tdId.setAttribute("class", "elementDBId");
            tdNumber = document.createElement("td");
            tdDate = document.createElement("td");
            tdProvider = document.createElement("td");
            tdActions = document.createElement("td");

            var but1 = document.createElement("button");
            but1.setAttribute("class", "btn btn-warning");
            but1.setAttribute("data-bs-toggle", "modal");
            but1.setAttribute("data-bs-target", "#EditorModal");
            but1.innerHTML = "Редактировать";

            but1.addEventListener('click', function (e) {
                openModalWindow(e.target);
            })

            var but2 = document.createElement("button");
            but2.setAttribute("class", "btn btn-danger");
            but2.innerHTML = "Удалить";

            but2.addEventListener('click', function (e) {

                deleteOrder(e.target);
            })

            tdId.innerHTML = items[i]["id"];
            tdNumber.innerHTML = items[i]["number"];
            tdDate.innerHTML = items[i]["date"];
            tdProvider.innerHTML = items[i]["provider"];

            tdActions.append(but1);
            tdActions.append(but2);
            tr2.append(tdId);
            tr2.append(tdNumber);
            tr2.append(tdDate);
            tr2.append(tdProvider);
            tr2.append(tdActions);
            tbody.append(tr2);
        }
        parentElement.append(thead);
        parentElement.append(tbody);
        
    }

    return parentElement;
}
async function fillSelectors(items) {
    var parentElement = document.getElementById('providers1');
    var parentElement2 = document.getElementById('providers2');
    var parentElement3 = document.getElementById('providers3');

    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            const option = document.createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = items[i]["name"];

            parentElement.append(option);
        }
     
        option = document.createElement("option");
        option.setAttribute("value", -1);
        option.innerHTML = "Все";
        parentElement2.append(option);
        for (let i = 0; i < items.length; i++) {
            option = document.createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = items[i]["name"];

            parentElement2.append(option);
        }

        for (let i = 0; i < items.length; i++) {
            const option = document.createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = items[i]["name"];

            parentElement3.append(option);
        }
    }
}
async function fillModalWindow(order, orderItems) {
    var parentElement = document.getElementById('updatingForm');

    document.getElementById('orderIdUpdate').innerText = order["id"];
    document.getElementById('providers3').value = order["providerId"];
    document.getElementById("orderNumberUpdate").value = order["number"];

    var currentDate = moment(order["date"], "YYYY-MM-DDTHH:mm:ss");
    document.getElementById("orderDateUpdate").value = currentDate.format("YYYY-MM-DDTHH:mm");

    var form = document.getElementById('updatingForm');
    while (form.querySelector('.itemUpdate')) {
        form.removeChild(form.querySelector('.itemUpdate'));
    }
    for (var i = 0; i < orderItems.length; i += 1) {
        var div1 = document.createElement("div");
        div1.setAttribute("class", "itemUpdate");

        var div2 = document.createElement("div");
        div2.setAttribute("class", "shadow p-3 mb-5 bg-light rounded");

        var div3 = document.createElement("div");
        div3.setAttribute("class", "row");

        var itemOptionDiv0 = document.createElement("div");
        itemOptionDiv0.setAttribute("class", "col-sm-1");

        var itemOptionDiv1 = document.createElement("div");
        itemOptionDiv1.setAttribute("class", "col-sm-3");

        var itemOptionDiv2 = document.createElement("div");
        itemOptionDiv2.setAttribute("class", "col-sm-3");

        var itemOptionDiv3 = document.createElement("div");
        itemOptionDiv3.setAttribute("class", "col-sm-3");

        var itemOptionDiv4 = document.createElement("div");
        itemOptionDiv4.setAttribute("class", "col-sm-1");


        var itemOption0 = document.createElement("h3");
        itemOptionDiv4.setAttribute("class", "idOrderItemUpdate");
        itemOption0.innerText = orderItems[i]["id"];

        var itemOption1 = document.createElement("input");
        itemOption1.setAttribute("class", "form-control form-control-lg");
        itemOption1.setAttribute("type", "text");
        itemOption1.setAttribute("value", orderItems[i]["name"]);
        itemOption1.setAttribute("placeholder", "Name");

        var itemOption2 = document.createElement("input");
        itemOption2.setAttribute("class", "form-control form-control-lg");
        itemOption2.setAttribute("type", "number");
        itemOption2.setAttribute("value", orderItems[i]["quantity"]);
        itemOption2.setAttribute("pattern", "^\d * (\.\d{ 0, 2}) ? $");
        itemOption2.setAttribute("placeholder", "Quantity");

        var itemOption3 = document.createElement("input");
        itemOption3.setAttribute("class", "form-control form-control-lg");
        itemOption3.setAttribute("type", "text");
        itemOption3.setAttribute("value", orderItems[i]["unit"]);
        itemOption3.setAttribute("placeholder", "Unit");

        var itemOption4 = document.createElement("button");
        itemOption4.setAttribute("class", "btn btn-danger");
        itemOption4.innerHTML = "Удалить";

        itemOption4.addEventListener('click', function (e) {
            deleteItemUpdate(e.target);
        })

        itemOptionDiv0.append(itemOption0);
        itemOptionDiv1.append(itemOption1);
        itemOptionDiv2.append(itemOption2);
        itemOptionDiv3.append(itemOption3);
        itemOptionDiv4.append(itemOption4);
        div3.append(itemOptionDiv0);
        div3.append(itemOptionDiv1);
        div3.append(itemOptionDiv2);
        div3.append(itemOptionDiv3);
        div3.append(itemOptionDiv4);
        div2.append(div3);
        div1.append(div2);
        parentElement.append(div1);
    }

}



async function addItem(parentElement, className) {

    const div1 = document.createElement("div");
    div1.setAttribute("class", className);

    const div2 = document.createElement("div");
    div2.setAttribute("class", "shadow p-3 mb-5 bg-light rounded");

    const div3 = document.createElement("div");
    div3.setAttribute("class", "row");


    const itemOptionDiv1 = document.createElement("div");
    itemOptionDiv1.setAttribute("class", "col-sm-2");

    const itemOptionDiv2 = document.createElement("div");
    itemOptionDiv2.setAttribute("class", "col-sm-2");

    const itemOptionDiv3 = document.createElement("div");
    itemOptionDiv3.setAttribute("class", "col-sm-2");

    const itemOptionDiv4 = document.createElement("div");
    itemOptionDiv4.setAttribute("class", "col-sm-1");


    const itemOption1 = document.createElement("input");
    itemOption1.setAttribute("class", "form-control form-control-lg");
    itemOption1.setAttribute("type", "text");
    itemOption1.setAttribute("value", "");
    itemOption1.setAttribute("placeholder", "Name");

    const itemOption2 = document.createElement("input");
    itemOption2.setAttribute("class", "form-control form-control-lg");
    itemOption2.setAttribute("type", "number");
    itemOption2.setAttribute("value", "");
    itemOption2.setAttribute("pattern", "^\d * (\.\d{ 0, 2}) ? $");
    itemOption2.setAttribute("placeholder", "Quantity");

    const itemOption3 = document.createElement("input");
    itemOption3.setAttribute("class", "form-control form-control-lg");
    itemOption3.setAttribute("type", "text");
    itemOption3.setAttribute("value", "");
    itemOption3.setAttribute("placeholder", "Unit");

    const itemOption4 = document.createElement("button");
    itemOption4.setAttribute("class", "btn btn-danger");
    itemOption4.innerHTML = "Удалить";

    itemOption4.addEventListener('click', function (e) {
        deleteItem(itemOption4);
    })

    itemOptionDiv1.append(itemOption1);
    itemOptionDiv2.append(itemOption2);
    itemOptionDiv3.append(itemOption3);
    itemOptionDiv4.append(itemOption4);
    div3.append(itemOptionDiv1);
    div3.append(itemOptionDiv2);
    div3.append(itemOptionDiv3);
    div3.append(itemOptionDiv4);
    div2.append(div3);
    div1.append(div2);
    parentElement.append(div1);
    return parentElement;
}



document.getElementById("addItemCreate").addEventListener("click", async () => {
    var parentElement = document.getElementById('creatingForm');
    var className = "itemAddCreate"; 
    await addItem(parentElement, className);
});

document.getElementById("addUpdateItem").addEventListener("click", async () => {
    var parentElement = document.getElementById('updatingForm');
    var className = "itemAddUpdate";
    await addItem(parentElement, className);
});

document.getElementById("Create").addEventListener("click", async () => {
    await buttonCreateOrder();
});

document.getElementById("saveUpdateChanges").addEventListener("click", async () => {
    await buttonUpdateOrder();
});

document.getElementById("getSelectionData").addEventListener("click", async () => {
    const start = document.getElementById("startDateFilter").value;
    const end = document.getElementById("endDateFilter").value;
    const providerId = document.getElementById("providers2").value;
    const orderNumber = document.getElementById("orderNumberFilter").value;
    const orderItemName = document.getElementById("orderItemNameFilter").value;
    const orderItemUnit = document.getElementById("orderItemUnitFilter").value;

    await getFilteredOrdersData(start, end, providerId, orderNumber, orderItemName, orderItemUnit);
});

window.addEventListener('load', () => {
    getAllOrdersData();
    getProvidersForSelectors();
});