'use strict';

import { Card } from "./components/Card.js";
//import components

import { NavItem } from "./components/NavItem.js";

//import util
import { activeNotebook, findNotebookIndex } from "./util.js";

const sidebarList = document.querySelector('[data-sidebar-list]')
const notePanelTitle = document.querySelector('[data-note-panel-title]')
const notePanel = document.querySelector('[data-note-panel]')
const noteCreateBtns = document.querySelectorAll('[data-note-create-btn]')//remove btn when no notebook

const emptyNotesTemplate = `<div class="empty-notes">
            <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>
            <div class="text-headline-small">A blank canvas</div>
        </div>`


export const client = {
    notebook: {
        create(notebookData) {
            const navItem = NavItem(notebookData.id, notebookData.name);
            sidebarList.appendChild(navItem);
            activeNotebook.call(navItem);
            notePanelTitle.textContent = notebookData.name
            notePanel.innerHTML = emptyNotesTemplate
            noteCreateBtns.forEach(btn => btn.classList.remove('hide'))
        },
        read(notebookList) {
            if (!notebookList.length) noteCreateBtns.forEach(btn => btn.classList.add('hide'))
            notebookList.forEach((notebookData, index) => {
                const navItem = NavItem(notebookData.id, notebookData.name);
                if (index === 0) {
                    activeNotebook.call(navItem);
                    notePanelTitle.textContent = notebookData.name
                }
                sidebarList.appendChild(navItem);
            })
        },
        update(notebookId, notebookData) {
            const oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`)
            const newNotebook = NavItem(notebookData.id, notebookData.name)
            notePanelTitle.textContent = notebookData.name
            sidebarList.replaceChild(newNotebook, oldNotebook)
            activeNotebook.call(newNotebook)
        },
        delete(notebookId) {
            const deleteNotebook = document.querySelector(`[data-notebook="${notebookId}"]`)
            const activeNavItem = deleteNotebook.nextElementSibling || deleteNotebook.previousElementSibling
            if (activeNavItem) {
                activeNavItem.click()
            } else {
                notePanelTitle.textContent = ''
                notePanel.innerHTML = ''
            }
            deleteNotebook.remove()

            const notebookList = JSON.parse(localStorage.getItem('spaceDB')).notebooks.length
            if (!notebookList) noteCreateBtns.forEach(btn => btn.classList.add('hide'))
        }
    },
    note: {
        create(noteData) {
            if (!notePanel.querySelector('[data-note]')) notePanel.innerHTML = ''
            const card = Card(noteData)
            notePanel.appendChild(card)
        },
        read(noteList) {
            if (noteList.length) {
                notePanel.innerHTML = ''
                noteList.forEach(noteData => {
                    const card = Card(noteData)
                    notePanel.appendChild(card)
                })
            } else {
                notePanel.innerHTML = emptyNotesTemplate
            }
        },
        update(noteId, noteData) {
            const oldCard = document.querySelector(`[data-note="${noteId}"]`)
            const newCard = Card(noteData)
            notePanel.replaceChild(newCard, oldCard)
        },
        delete(noteId, noteLength) {
            document.querySelector(`[data-note="${noteId}"]`).remove()
            if (!noteLength) notePanel.innerHTML = emptyNotesTemplate
        }
    }
}