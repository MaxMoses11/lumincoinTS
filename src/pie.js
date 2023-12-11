const incomePie = new Chart(document.getElementById('pie1'), {
    type: 'pie',
    data: {
        labels: [
            'Red',
            'Orange',
            'Yellow',
            'Green',
            'Blue'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100, 30, 170],
            backgroundColor: [
                '#DC3545',
                '#FD7E14',
                '#FFC107',
                '#20C997',
                '#0D6EFD',
            ],
            hoverOffset: 4
        }]
    }
});
const expensesPie = new Chart(document.getElementById('pie2'), {
    type: 'pie',
    data: {
        labels: [
            'Red',
            'Orange',
            'Yellow',
            'Green',
            'Blue'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [150, 70, 100, 90, 110],
            backgroundColor: [
                '#DC3545',
                '#FD7E14',
                '#FFC107',
                '#20C997',
                '#0D6EFD',
            ],
            hoverOffset: 4
        }]
    }
});