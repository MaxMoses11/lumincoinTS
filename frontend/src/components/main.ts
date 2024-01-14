import Chart from 'chart.js/auto';
import {RemoveActive} from "../utils/remove-active.ts";
import {CalcBalance} from "../services/calc-balance.ts";
import {Filter} from "../services/filter.ts";

export class Main {
    operationsArray = null;
    incomeChart = null;
    expenseChart = null;

    filterElement = document.getElementById('filter-buttons');
    dateFromElem = document.getElementById('date-from');
    dateToElem = document.getElementById('date-to');
    intervalBtn = document.getElementById('interval');
    incomePie = document.getElementById('pie1');
    expensePie = document.getElementById('pie2');

    constructor() {
        RemoveActive.remove();
        document.getElementById('main').classList.add('active');

        this.init();

        this.filterActions();
    }

    async init(period, dateFrom, dateTo) {
        if (period) {
            this.incomeChart.destroy();
            this.expenseChart.destroy();
        }
        await CalcBalance.getBalance();

        const color = [
            '#DC3545', '#20C997', '#FD7E14', '#54729d', '#FFC107',
            '#052c67', '#6507c9', '#c907a9', '#0755c9', '#0dfd19',
            '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
            '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
            '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
            '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
            '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
            '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
            '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
            '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
            '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
            '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
        ]

        let optionIncomeChart = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    hoverOffset: 4
                }]
            }
        }

        let optionExpenseChart = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    hoverOffset: 4
                }]
            }
        }

        try {
            this.operationsArray = await Filter.getOperations(period, dateFrom, dateTo);

            if (this.operationsArray) {
                let incomeArray = this.operationsArray.filter(item => item.type === 'income');
                let expenseArray = this.operationsArray.filter(item => item.type === 'expense');

                for (let i = 0; i < incomeArray.length; i++) {
                    if (Object.keys(incomeArray[i]).includes('category')) {
                        let index = optionIncomeChart.data.labels.indexOf(incomeArray[i].category);
                        if (index !== -1) {
                            optionIncomeChart.data.datasets[0].data.splice(index, 1, optionIncomeChart.data.datasets[0].data[index] + incomeArray[i].amount);
                        } else {
                            optionIncomeChart.data.labels.push(incomeArray[i].category);
                            optionIncomeChart.data.datasets[0].data.push(incomeArray[i].amount);
                            optionIncomeChart.data.datasets[0].backgroundColor.push(color[i]);
                        }
                    }
                }

                for (let i = 0; i < expenseArray.length; i++) {
                    if (Object.keys(expenseArray[i]).includes('category')) {
                        let index = optionExpenseChart.data.labels.indexOf(expenseArray[i].category);
                        if (index !== -1) {
                            optionExpenseChart.data.datasets[0].data.splice(index, 1, optionExpenseChart.data.datasets[0].data[index] + expenseArray[i].amount);
                        } else {
                            optionExpenseChart.data.labels.push(expenseArray[i].category);
                            optionExpenseChart.data.datasets[0].data.push(expenseArray[i].amount);
                            optionExpenseChart.data.datasets[0].backgroundColor.push(color[i]);
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        this.incomeChart = new Chart(this.incomePie, optionIncomeChart);
        this.expenseChart = new Chart(this.expensePie, optionExpenseChart);
    }

    filterActions() {
        const dateInputs = [
            this.dateFromElem,
            this.dateToElem
        ];

        this.filterElement.onclick = (event) => {
            let target = event.target;

            if (!target.classList.contains('btn') || target.id === 'interval') {
                return;
            }
            dateInputs.forEach(item => {
                item.setAttribute('disabled', 'disabled');
                item.value = '';
            });
            Filter.activeBtnManager(this.filterElement);
            target.classList.add('active');
            if (this.dateFromElem.value && this.dateToElem.value) {
                this.init(target.id, this.dateFromElem.value, this.dateToElem.value);
            } else {
                this.init(target.id);
            }
        }

        this.intervalBtn.onclick = (e) => {
            Filter.activeBtnManager(this.filterElement);
            dateInputs.forEach(item => item.removeAttribute('disabled'));
            e.target.classList.add('active');
        }

        dateInputs.forEach(item => {
            item.onchange = () => {
                if (this.dateFromElem.value && this.dateToElem.value) {
                    this.init('interval', this.dateFromElem.value, this.dateToElem.value);
                }
            }
        });
    }
}