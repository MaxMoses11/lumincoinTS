import Chart, {ChartItem} from 'chart.js/auto';
import {RemoveActive} from "../utils/remove-active";
import {CalcBalance} from "../services/calc-balance";
import {Filter} from "../services/filter";
import {OperationResponseType} from "../types/operation-response.type";

export class Main {
    private incomeChart: Chart | undefined;
    private expenseChart: Chart | undefined;

    private filterElement: HTMLElement | null = document.getElementById('filter-buttons');
    private dateFromElem: HTMLInputElement | null = document.getElementById('date-from') as HTMLInputElement;
    private dateToElem: HTMLInputElement | null = document.getElementById('date-to') as HTMLInputElement;
    private intervalBtn: HTMLElement | null = document.getElementById('interval');
    private incomePie: ChartItem = document.getElementById('pie1') as HTMLCanvasElement;
    private expensePie: ChartItem = document.getElementById('pie2') as HTMLCanvasElement;

    constructor() {
        RemoveActive.remove();
        const mainElement: HTMLElement | null = document.getElementById('main');
        if (mainElement) {
            mainElement.classList.add('active');
        }

        this.init();

        this.filterActions();
    }

    private async init(period?: string, dateFrom?: string, dateTo?: string): Promise<void> {
        if (period) {
            if (this.incomeChart && this.expenseChart) {
                this.incomeChart.destroy();
                this.expenseChart.destroy();
            }
        }
        await CalcBalance.getBalance();

        const color: string[] = [
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

        let optionIncomeChart: any = {
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

        let optionExpenseChart: any = {
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
            const operationsArray: OperationResponseType[] | undefined = await Filter.getOperations(period, dateFrom, dateTo);

            if (operationsArray) {
                const incomeArray: OperationResponseType[] = operationsArray.filter(item => item.type === 'income');
                const expenseArray: OperationResponseType[] = operationsArray.filter(item => item.type === 'expense');

                for (let i = 0; i < incomeArray.length; i++) {
                    if (Object.keys(incomeArray[i]).includes('category')) {
                        let index: number = optionIncomeChart.data.labels.indexOf(incomeArray[i].category);
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
                        let index: number = optionExpenseChart.data.labels.indexOf(expenseArray[i].category);
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

    private filterActions(): void {
        if (!this.filterElement) return;
        const dateInputs: (HTMLInputElement | null)[] = [
            this.dateFromElem,
            this.dateToElem
        ];

        this.filterElement.onclick = (event): void => {
            let target: any = event.target;

            if (!target.classList.contains('btn') || target.id === 'interval') {
                return;
            }
            dateInputs.forEach(item => {
                (item as HTMLInputElement).setAttribute('disabled', 'disabled');
                (item as HTMLInputElement).value = '';
            });
            Filter.activeBtnManager(this.filterElement);
            target.classList.add('active');
            if (this.dateFromElem && this.dateToElem && this.dateFromElem.value && this.dateToElem.value) {
                this.init(target.id, this.dateFromElem.value, this.dateToElem.value);
            } else {
                this.init(target.id);
            }
        }

        if (this.intervalBtn) {
            this.intervalBtn.onclick = (e) => {
                const target: any = e.target;
                Filter.activeBtnManager(this.filterElement);
                dateInputs.forEach(item => (item as HTMLInputElement).removeAttribute('disabled'));
                target.classList.add('active');
            }
        }

        dateInputs.forEach(item => {
            (item as HTMLInputElement).onchange = () => {
                if (this.dateFromElem && this.dateToElem && this.dateFromElem.value && this.dateToElem.value) {
                    this.init('interval', this.dateFromElem.value, this.dateToElem.value);
                }
            }
        });
    }
}