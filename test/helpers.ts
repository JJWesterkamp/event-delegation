export const createDiv = (className?: string) => {
    const div = document.createElement('div')
    div.className = className || ''
    return div
}