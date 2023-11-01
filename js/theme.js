'use strict';

const savedTheme = localStorage.getItem('theme')
const isThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const currTheme = savedTheme || (isThemeDark ? 'dark' : 'light')
document.documentElement.setAttribute('data-theme', currTheme)

window.addEventListener('DOMContentLoaded', () => {
    const themeChangeBtn = document.querySelector('[data-theme-btn]')
    themeChangeBtn.addEventListener('click', function () {
        const presentTheme = document.documentElement.getAttribute('data-theme')
        const newTheme = presentTheme === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    })
})