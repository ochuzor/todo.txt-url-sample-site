'use strict';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; // Import precompiled Bootstrap css
import '@fortawesome/fontawesome-free/css/all.css';

import $ from 'jquery';
import _ from 'lodash';
import {textToIndexDto} from '@ochuzor/todo.txt-parser';

import sampleTodos from './sample-todos';
import db, {nextId} from './db';

function t(s,d){
    for(var p in d)
      s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
    return s;
}
// t("Hello {who}!", { who: "JavaScript" });
// "Hello JavaScript!"

$(function () {
    const todoTxtEdit = $('#oc-todo-text-edit');
    const lstCntr = $('#oc-todo-lst-cntr');
    const searchBox = $('#oc-todo-search-box');
    const todoSaveBtn = $('#oc-todo-save-btn');
    const detailsCntr = $('#oc-todo-details-cntr');
    const editTodoModal = $('#oc-edit-todo-modal');
    const todoDeleteBtn = $('#oc-todo-delete-btn');

    const allTodos = db.getAll();

    const compiled = _.template('<% _.forEach(todos, function(todo, i) { %><div data-toggle="modal" data-target="#oc-edit-todo-modal" data-todo-text="${ todo.text }" todo-id="${ todo.id }" class="oc-todo-itm">${ todo.text }</div><% }); %>');
    
    function renderTodoList(lsTodos) {
        const todos = compiled({ todos: lsTodos });
        lstCntr.html(todos);
    }

    lstCntr.on('click', '.oc-todo-itm', function() {
        const id = $(this).attr('todo-id');
        const text = $(this).text();
        todoTxtEdit.val(text);
        setTodoEdit({text, id});
    });

    function onTodoTextChange() {
        displayTodoDetails($(this).val());
    }

    function onTodoSearch() {
        const val = $(this).val();
        const ls = _.isEmpty(val) ? allTodos : doSearch(val);
        renderTodoList(ls);
    }

    function doSearch(str) {
        return db.search(str);
    }

    const todoDetailItemComponentString = `<div>
    <small class="text-muted">{label}:</small>
    <h4 class="ml-2">{value}</h4>
    </div>`;
    const todoDetailItemComponent = _.partial(t, todoDetailItemComponentString);

    function displayTodoDetails(todoText) {
        const data = _.pickBy(textToIndexDto(todoText), _.identity);
        const _data = _.omit(data, ['text'])
        const html = _.reduce(_data, (acc, value, key) => {
            return acc + todoDetailItemComponent({label: _.startCase(key), value});
        }, '');
        detailsCntr.html(html);
    }

    todoSaveBtn.click(function() {
        let id = todoTxtEdit.attr('data-todo-id');
        if (_.isEmpty(id)) id = nextId();
        else id = parseInt(id, 10);

        saveTodo({text: todoTxtEdit.val(), id});
        editTodoModal.modal('hide');
    });

    todoDeleteBtn.click(function () {
        let id = todoTxtEdit.attr('data-todo-id');
        if (!_.isEmpty(id) && confirm('Are you sure you want to delete?')) {
            deleteTodo(parseInt(id, 10));
            editTodoModal.modal('hide');
        }
    });

    todoTxtEdit.on('input', _.debounce(onTodoTextChange, 250, { 'maxWait': 1000 }));
    searchBox.on('input', _.debounce(onTodoSearch, 250, { 'maxWait': 1000 }));

    editTodoModal.on('shown.bs.modal', function () {
        todoTxtEdit.focus();
    });

    editTodoModal.on('hidden.bs.modal', function () {
        setTodoEdit({text: '', id: ''});
    });

    function setTodoEdit(todo) {
        todoTxtEdit.val(todo.text);
        todoTxtEdit.attr('data-todo-id', todo.id);
        displayTodoDetails(todo.text);
    }

    function saveTodo(todo) {
        db.addDoc(todo);
        refreshTodoList();
    }

    function deleteTodo(id) {
        db.deleteDoc(id);
        refreshTodoList();
    }

    function refreshTodoList() { 
        allTodos.length = 0;
        Array.prototype.push.apply(allTodos, db.getAll());
        searchBox.trigger('input');
    }

    (function run() {
        renderTodoList(allTodos);
    })();
});
