export class RemoveActive {
    static remove() {
        const menuItems = [
            document.getElementById('main'),
            document.getElementById('operations'),
            document.getElementById('categories'),
            document.getElementById('income'),
            document.getElementById('expense'),
        ]

        const cElem = menuItems[2];
        if (cElem.classList.contains('collapsed')) {
            cElem.classList.remove('active');
        } else {
            cElem.classList.add('active');
        }

        menuItems.forEach(item => {
           item.classList.remove('active');
        });
    }
}