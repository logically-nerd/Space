'use strict'
//import db
import { db } from './db.js'

//import util
import { activeNotebook, makeElemEditable } from "./util.js";

//import client
import { client } from './client.js';

//import components
import { Tooltip } from './components/Tooltip.js';
import { NavItem } from './components/NavItem.js';
import { NoteModal } from './components/Modal.js';

// functions

const addEventOnElements = function ($elements, eventType, callback) {
    $elements.forEach(element => {
        element.addEventListener(eventType, callback)
    });
}

const checkTime = function (time) {
    if (12_00_00 >= time && time >= 0) {
        return 'Morning'
    }
    if (12_00_00 < time && time <= 17_00_00) {
        return 'Afternoon'
    }
    if (24_00_00 >= time && time > 17_00_00) {
        return 'Evening'
    }
}

const setDate = function () {
    const currTime = new Date().toDateString().split(' ')
    const time = `<br><span class="text-title-medium">${currTime[0]}</span>` + currTime[2] + ' ' + currTime[1] + ', ' + currTime[3]
    return time;
}


const $sidebar = document.querySelector('[data-sidebar]')
const $sidebarToggler = document.querySelectorAll('[data-sidebar-toggler]')
const $overlay = document.querySelector('[data-sidebar-overlay]')

addEventOnElements($sidebarToggler, 'click', function () {
    $sidebar.classList.toggle('active')
    $overlay.classList.toggle('active')
})

// greetings

const greetings = document.querySelector('[data-greeting]')
const time = new Date().getHours() * 1_00_00 + new Date().getMinutes() * 1_00 + new Date().getSeconds()
const greet = checkTime(time)
greetings.textContent = `Good ${greet},`

//date 

const dateTime = document.querySelector('[data-current-date]')
dateTime.innerHTML = setDate()

//tooltip

const tooltipElements = document.querySelectorAll('[data-tooltip]')
tooltipElements.forEach(element => Tooltip(element))

// create notebook

const createNotebook = function (event) {
    if (event.key === 'Enter') {
        const notebookData = db.post.notebook(this.textContent || 'New Miscellany')
        this.parentElement.remove();
        //render nav item
        client.notebook.create(notebookData)
    }
    if (event.key === 'Escape') {
        this.parentElement.remove();
    }
}

const sidebarList = document.querySelector('[data-sidebar-list]')
const addNotebook = document.querySelector('[data-add-notebook]')
const showNotebookField = function () {
    const navItem = document.createElement('div')
    navItem.classList.add('nav-item')
    navItem.innerHTML = `
        <span class="text text-label-large" data-notebook-field></span>
        <div class="state-layer"></div>
    `
    sidebarList.appendChild(navItem)
    //activate new created notebook and remove active from rest
    const navItemField = navItem.querySelector('[data-notebook-field]')
    activeNotebook.call(navItem)

    //input field
    makeElemEditable(navItemField)
    navItemField.addEventListener('keydown', createNotebook)
}
addNotebook.addEventListener('click', showNotebookField)

//render pre-existing notebook
const renderExistedNotebook = function () {
    const notebookList = db.get.notebook()
    client.notebook.read(notebookList)
}
renderExistedNotebook()

//create note

const noteCreatebtn = document.querySelectorAll('[data-note-create-btn]')
addEventOnElements(noteCreatebtn, 'click', function () {
    const modal = NoteModal()
    modal.open()

    modal.onSubmit(noteObj => {
        const activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook
        const noteData = db.post.note(activeNotebookId, noteObj)
        // console.log(noteData)
        client.note.create(noteData)
        modal.close()
    })
})

const renderExistedNote = function () {
    const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook
    if(activeNotebookId){
        const noteList = db.get.note(activeNotebookId)
        // console.log(noteList)
        client.note.read(noteList)
    }
}
renderExistedNote()