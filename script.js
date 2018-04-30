var toDoList = []; //массив для хранения при перезагрузке страницы

if (localStorage.getItem('toDoList') != undefined) { //сохраняем задачи в локал сторадже, но пока не рабоает
    toDoList = JSON.parse(localStorage.getItem('toDoList'));
}

var active = new Map(); //массивы под данные задач
var archive = new Map();

var activeIndex = 1; //индексы задач в активе и архиве
var archiveIndex = 1;


function structTask(time, task) { //структура задачи
    this.time = time;
    this.task = task;
}

document.getElementById('inputTask').addEventListener('keydown', function (keyboard) { //ввод задачи по нажатию Enter
    var value = this.value;
    if (keyboard.code === 'Enter' && value) {
        add(value);
    }
});

//Удаление задачи по нажатию Enter
document.getElementById('inputRemove').addEventListener('keydown', function (keyboard) { //ввод номера удаляемой задачи по нажатию Enter
    var value = this.value;
    if (keyboard.code === 'Enter' && value) {
        remove(value);
    }
});

//Отправка задачи в архив по нажатию Enter
document.getElementById('inputDone').addEventListener('keydown', function (keyboard) { //ввод номера архивируемой задачи по нажатию Enter
    var value = this.value;
    if (keyboard.code === 'Enter' && value) {
        toArchive(value);
    }
});

function add() { //добавляем задачу
    toDoList.task = document.getElementById('inputTask').value; //сама задача
    toDoList.time = Date.now(); //время старта
    toDoList.index = activeIndex; //индекс
    localStorage.setItem('toDoList', JSON.stringify(toDoList)); //сохраняем на локал через джейсона

    active.set(activeIndex, new structTask(toDoList.time, toDoList.task)); //создаем уникальный экземпляр активных задач

    var tr = document.createElement('tr'); //создаем соответствующие поля под индекс и текст задачи
    tr.id = activeIndex;

    var itemIndex = document.createElement('td');
    itemIndex.textContent = activeIndex;

    var itemTask = document.createElement('td');
    itemTask.textContent = toDoList.task;

    tr.appendChild(itemIndex); //создаем дочерний узел, куда добавляются все данные
    tr.appendChild(itemTask);

    activeTasks.appendChild(tr);

    activeIndex++; //индекс увеличиваем для следующей задачи
    inputTask.value = '';
}

function remove(index = Number.parseInt(document.getElementById('inputRemove').value)) { //получаем индекс удаляемой задачи
    active.delete(index); //удаляем

    var element = document.getElementById(index);
    if (element != null) {
        element.remove();
    }

    inputRemove.value = '';
}

function toArchive(index = Number.parseInt(document.getElementById('inputDone').value)) { //получаем индекс архивируемой задачи

    var obj = active.get(index);

    var delta = Date.now() - obj.time; //считаем время с момента создания
    archive.set(archiveIndex, new structTask(delta, obj.task)); //создаем архивный элемент

    var tr = document.createElement('tr');
    tr.id = archiveIndex;

    var itemIndex = document.createElement('td');
    itemIndex.textContent = archiveIndex;

    var itemTime = document.createElement('td');
    itemTime.textContent = delta / 1000; //в секундах, а не в милисекундах

    var itemTask = document.createElement('td');
    itemTask.textContent = obj.task;

    tr.appendChild(itemIndex);
    tr.appendChild(itemTask);
    tr.appendChild(itemTime);

    archiveTasks.appendChild(tr);

    remove(index); //индексация уже новая

    archiveIndex++;

    inputDone.value = '';
}

function sortByNumber(activeTasks = document.getElementById('activeTasks'), archiveTasks = document.getElementById('archiveTasks')) { //сортировка по номеру

    var sorted;

    sorted = new Map(Array.from(active.entries()).sort((a, b) => a[0] > b[0])); 

    while (activeTasks.firstChild) {
        activeTasks.removeChild(activeTasks.firstChild);
    }

    for (var entry of sorted) {
        var tr = document.createElement('tr');
        tr.id = entry[0];

        var itemIndex = document.createElement('td');
        itemIndex.textContent = entry[0];

        var itemTask = document.createElement('td');
        itemTask.textContent = entry[1].task;

        tr.appendChild(itemIndex);
        tr.appendChild(itemTask);

        activeTasks.appendChild(tr);
    }
}

function sortByName(activeTasks = document.getElementById('activeTasks'), archiveTasks = document.getElementById('archiveTasks')){ //сортировка по буквам

    var sorted;

    sorted = new Map(Array.from(active.entries()).sort((a, b) => a[1].task > b[1].task));

    while (activeTasks.firstChild) {
        activeTasks.removeChild(activeTasks.firstChild);
    }

    for (var entry of sorted) {
        var tr = document.createElement('tr');
        tr.id = entry[0];

        var itemIndex = document.createElement('td');
        itemIndex.textContent = entry[0];

        var itemTask = document.createElement('td');
        itemTask.textContent = entry[1].task;

        tr.appendChild(itemIndex);
        tr.appendChild(itemTask);

        activeTasks.appendChild(tr);
    }
}