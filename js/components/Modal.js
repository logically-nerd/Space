'use strict';

const overlay = document.createElement('div')
overlay.classList.add('overlay', 'modal-overlay')

const DeleteConfirmModal = function (title) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML =
        `
            <h3 class="modal-title text-title-medium">
                You sure you want to delete <strong>' ${title} '</strong> ?
            </h3>
            <div class="modal-footer">
                <button class="btn fill" data-action-btn="false">
                    <span class="text-label-large">Cancel</span>
                    <div class="state-layer"></div>
                </button>
                <button class="btn text" data-action-btn="true">
                    <span class="text-label-large">Delete</span>
                    <div class="state-layer"></div>
                </button>
            </div>
        `
    const open = function () {
        document.body.appendChild(modal)
        document.body.appendChild(overlay)
    }

    const close = function () {
        modal.remove()
        overlay.remove()
    }

    const actionBtn = modal.querySelectorAll('[data-action-btn]')
    const onSubmit = function (callback) {
        actionBtn.forEach(btn => btn.addEventListener('click', function () {
            const isConfirm = this.dataset.actionBtn === 'true' ? true : false
            callback(isConfirm)
        }))
    }

    return { open, close, onSubmit }//passing this as an object
}

const NoteModal = function (title = '', text = '', time = '') {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `
            <button class="icon-btn large" aria-label="Close modal" data-close-btn>
                <span class="material-symbols-rounded" aria-hidden="true">close</span>
                <div class="state-layer"></div>
            </button>
            <input type="text" placeholder="Untitled" id="Untitled" value= "${title}"
                class="modal-title text-title-medium" data-note-field>
            <textarea placeholder="Get creative and have fun!" class="modal-text text-body-large custom-scrollbar"
                data-note-field>${text}</textarea>
            <div class="modal-footer">
                <span class="time text-label-large">${time}</span>
                <button class="btn text" data-submit-btn>
                    <span class="text-label-large">Save</span>
                    <div class="state-layer"></div>
                </button>
            </div>
    `
    const [titleField, textField] = modal.querySelectorAll('[data-note-field]')

    const open = function () {
        document.body.appendChild(modal)
        document.body.appendChild(overlay)
    }
    const close = function () {
        document.body.removeChild(modal)
        document.body.removeChild(overlay)
    }

    const closeBtn = modal.querySelector('[data-close-btn]')
    closeBtn.addEventListener('click', close)

    const submitBtn = modal.querySelector('[data-submit-btn]')
    submitBtn.disabled = true

    const enableSubmit = function () {
        submitBtn.disabled = !(titleField.value && textField.value)
    }
    textField.addEventListener('keyup', enableSubmit)
    titleField.addEventListener('keyup', enableSubmit)

    const onSubmit = function (callback) {
        submitBtn.addEventListener('click', function () {
            const noteData = {
                title: titleField.value,
                text: textField.value
            }
            callback(noteData)
        })
    }

    return { open, close, onSubmit }
}

export {
    DeleteConfirmModal,
    NoteModal
}