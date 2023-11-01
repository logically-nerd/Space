let lastActiveNavItem;
const activeNotebook = function () {
    lastActiveNavItem?.classList.remove('active')
    this.classList.add('active')
    lastActiveNavItem = this
}

const makeElemEditable = function (element) {
    element.setAttribute('contenteditable', true)
    element.focus()
}

const findNotebook = function (db, notebookId) {
    return db.notebooks.find(notebook => notebook.id === notebookId)
}

const findNotebookIndex = function (db, notebookId) {
    return db.notebooks.findIndex(item => item.id === notebookId)
}

const findNote = (db, noteId) => {
    let note
    //optimise
    for (const notebook of db.notebooks) {
        note = notebook.notes.find(note => note.id === noteId)
        if (note) break;
    }
    return note
}
const findNoteIndex = function (notebook, noteId) {
    return notebook.notes.findIndex(note => note.id === noteId)
}

export {
    activeNotebook,
    makeElemEditable,
    findNotebook,
    findNotebookIndex,
    findNote,
    findNoteIndex
}