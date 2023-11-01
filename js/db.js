'use strict'

import { findNote, findNoteIndex, findNotebook, findNotebookIndex } from "./util.js"

// db object
let spaceDB = {}
const initDB = function () {
    //check if db exist else create new
    const db = localStorage.getItem('spaceDB')
    if (db) {
        spaceDB = JSON.parse(db)
    } else {
        spaceDB.notebooks = [];
        localStorage.setItem('spaceDB', JSON.stringify(spaceDB))
    }
}
initDB();

const readDB = function () {
    //read and load the db
    spaceDB = JSON.parse(localStorage.getItem('spaceDB'))
}

const writeDB = function () {
    //update the db 
    localStorage.setItem('spaceDB', JSON.stringify(spaceDB))
}

const generateID = function () {
    //generate unique id based on current timestamp
    return new Date().getTime().toString()
}

export const db = {
    post: {
        //add new notebook
        notebook(name) {
            readDB();

            const notebookData = {
                id: generateID(),
                name,
                notes: []
            }
            spaceDB.notebooks.push(notebookData)
            writeDB();
            return notebookData
        },
        note(notebookId, obj) {
            readDB()
            const notebook = findNotebook(spaceDB, notebookId)
            const noteData = {
                id: generateID(),
                notebookId,
                ...obj,
                postedOn: new Date().getTime()
            }
            // console.log(noteData)
            notebook.notes.unshift(noteData)
            writeDB()
            return noteData
        }
    },
    get: {
        notebook() {
            readDB();
            return spaceDB.notebooks
        },
        note(notebookId) {
            readDB()
            const notebook = findNotebook(spaceDB, notebookId)
            return notebook.notes
        }
    },
    update: {
        notebook(notebookId, name) {
            readDB()
            const notebook = findNotebook(spaceDB, notebookId)
            notebook.name = name
            writeDB()
            return notebook
        },
        note(noteId, noteData) {
            readDB()

            const oldNote = findNote(spaceDB, noteId)
            const newNote = Object.assign(oldNote, noteData)
            writeDB()
            return newNote
        }
    },
    delete: {
        notebook(notebookId) {
            readDB()
            const notebookIndex = findNotebookIndex(spaceDB, notebookId)
            spaceDB.notebooks.splice(notebookIndex, 1)
            writeDB()
        },
        note(notebookId, noteId) {
            readDB()

            const notebook = findNotebook(spaceDB, notebookId)
            const noteIndex = findNoteIndex(notebook, noteId)
            notebook.notes.splice(noteIndex, 1)
            writeDB()
            return notebook.notes
        }
    }
}