import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // Import precompiled Bootstrap css
import '@fortawesome/fontawesome-free/css/all.css'

import $ from 'jquery';
import _ from 'lodash';
import {textToIndexDto} from '@ochuzor/todo.txt-parser';

import sampleTodos from './sample-todos';

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

    const compiled = _.template('<% _.forEach(todos, function(todo, i) { %><div data-toggle="modal" data-target="#oc-edit-todo-modal" data-todo-text="${ todo.text }" todo-id="${ todo.id }" class="oc-todo-itm">${ todo.text }</div><% }); %>');
    
    function renderTodoList(lsTodos) {
        const todos = compiled({ todos: lsTodos });
        lstCntr.html(todos);
    }

    renderTodoList(sampleTodos.map((text, i) => ({id: i+1, text})));

    $('.oc-todo-itm').click(function() {
        const id = $(this).attr('todo-id');
        const todoTxt = $(this).text();
        todoTxtEdit.val(todoTxt);
        displayTodoDetails(todoTxt);
        console.log('id: ' + id)
    });

    function onTodoTextChange() {
        // const val = $(this).val();
        // const data = _.pickBy(textToIndexDto(val), _.identity);
        // displayTodoDetails(data);
        displayTodoDetails($(this).val());
    }

    function onTodoSearch() {
        const val = $(this).val();
        console.log('search for:', val);
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
            return acc + todoDetailItemComponent({label: key, value});
        }, '');
        detailsCntr.html(html);
    }

    todoSaveBtn.click(function() {
        console.log('saving...', todoTxtEdit.val())
    });

    todoTxtEdit.on('input', _.debounce(onTodoTextChange, 250, { 'maxWait': 1000 }));
    searchBox.on('input', _.debounce(onTodoSearch, 250, { 'maxWait': 1000 }));

    function render() {}
});