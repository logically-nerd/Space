'use strict';

import { client } from "../client.js";
import { db } from "../db.js";
import { DeleteConfirmModal, NoteModal } from "./Modal.js";
import { Tooltip } from "./Tooltip.js";

const calTime = function (postedOn) {
    const currTime = new Date().getTime()
    const diff = currTime - postedOn
    const min = Math.floor(diff / 60000)
    const hour = Math.floor(min / 60)
    const day = Math.floor(hour / 24)
    return min < 1 ? 'Just now' : min < 60 ? `${min} min ago` : hour < 24 ? `${hour} hr ago` : `${day} day ago`
}

export const Card = function (noteData) {
    const { id, title, text, postedOn, notebookId } = noteData
    const card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-note', id)
    card.innerHTML = `
                <h3 class="card-title text-title-medium">${title}</h3>
                <p class="card-text text-body-large">${text}</p>
                <div class="wrapper">
                    <span class="card-time text-label-large">${calTime(postedOn)}</span>
                    <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-btn>
                        <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                        <div class="state-layer"></div>
                    </button>
                </div>
                <div class="state-layer"></div>
                `

    Tooltip(card.querySelector('[data-tooltip]'))

    card.addEventListener('click', function () {
        const modal = NoteModal(title, text, calTime(postedOn))
        modal.open()

        modal.onSubmit(function (noteData) {
            const updatedData = db.update.note(id, noteData)
            client.note.update(id, updatedData)
            modal.close()
        })
    })

    const deleteBtn = card.querySelector('[data-delete-btn')
    deleteBtn.addEventListener('click', function (event) {
        event.stopImmediatePropagation()
        const modal = DeleteConfirmModal(title)
        modal.open()
        modal.onSubmit(function (isConfirm) {
            if (isConfirm) {
                const existedNote = db.delete.note(notebookId, id)
                client.note.delete(id, existedNote.length)
            }
            modal.close()
        })
    })

    return card
}