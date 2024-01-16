export class RemoveActive {
    public static remove(): void {
        const menuItems: (HTMLElement | null)[] = [
            document.getElementById('main'),
            document.getElementById('operations'),
            document.getElementById('categories'),
            document.getElementById('income'),
            document.getElementById('expense'),
        ]

        const cElem: HTMLElement | null = menuItems[2];
        if (cElem) {
            if (cElem.classList.contains('collapsed')) {
                cElem.classList.remove('active');
            } else {
                cElem.classList.add('active');
            }
        }

        menuItems.forEach((item: HTMLElement | null) => {
           (item as HTMLElement).classList.remove('active');
        });
    }
}