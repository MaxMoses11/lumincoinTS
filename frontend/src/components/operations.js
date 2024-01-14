import {RemoveActive} from "../utils/remove-active.js";
import {Filter} from "../services/filter.js";
import {HtmlBlocks} from "../config/html-blocks.js";
import {CustomHttp} from "../services/custom-http.js";
import {config} from "../config/config.js";
import {CalcBalance} from "../services/calc-balance.js";

export class Operations {
    operations = null;
    operationId = null;

    tBodyElement = document.getElementById('tbody');
    filterBtnElem = document.getElementById('filter-buttons');
    dateFromElem = document.getElementById('date-from');
    dateToElem = document.getElementById('date-to');
    intervalBtn = document.getElementById('interval');
    createButtons = document.getElementById('create-buttons');

    constructor() {
        RemoveActive.remove();
        document.getElementById('operations').classList.add('active');
        document.getElementById('day').classList.add('active');

        this.init();

        this.filterActions();

        this.operationActions();
    }

    async init(period, dateFrom, dateTo) {
        this.operations = await Filter.getOperations(period, dateFrom, dateTo);
        this.operations.sort((a, b) => a.id - b.id);
        this.buildOperationsTable();
        await CalcBalance.getBalance();
    }

    buildOperationsTable() {
        const that = this;
        this.tBodyElement.innerHTML = '';

        this.operations.forEach(item => {
            const trElem = document.createElement('tr');
            trElem.setAttribute('id', 'operation-' + item.id);

            const thElem = document.createElement('th');
            thElem.setAttribute('scope', 'row');
            thElem.innerText = item.id;

            const tdTypeElem = document.createElement('td');
            if (item.type === 'income') {
                tdTypeElem.classList.add('text-success');
                tdTypeElem.innerText = 'доход';
            } else {
                tdTypeElem.classList.add('text-danger');
                tdTypeElem.innerText = 'расход';
            }

            const tdCategoryElem = document.createElement('td');
            tdCategoryElem.innerText = item.category;

            const tdAmountElem = document.createElement('td');
            tdAmountElem.innerText = item.amount + '$';

            const tdDateElem = document.createElement('td');
            tdDateElem.innerText = item.date;

            const tdCommentElem = document.createElement('td');
            tdCommentElem.innerText = item.comment;

            const tdIconsElem = document.createElement('td');
            tdIconsElem.innerHTML = HtmlBlocks.icons;

            trElem.appendChild(thElem);
            trElem.appendChild(tdTypeElem);
            trElem.appendChild(tdCategoryElem);
            trElem.appendChild(tdAmountElem);
            trElem.appendChild(tdDateElem);
            trElem.appendChild(tdCommentElem);
            trElem.appendChild(tdIconsElem);

            that.tBodyElement.appendChild(trElem);
        });
    }

    filterActions() {
        const dateInputs = [
            this.dateFromElem,
            this.dateToElem
        ];

        this.filterBtnElem.onclick = (event) => {
            let target = event.target;

            if (!target.classList.contains('btn') || target.id === 'interval') {
                return;
            }
            dateInputs.forEach(item => {
                item.setAttribute('disabled', 'disabled');
                item.value = '';
            });
            Filter.activeBtnManager(this.filterBtnElem);
            target.classList.add('active');
            if (this.dateFromElem.value && this.dateToElem.value) {
                this.init(target.id, this.dateFromElem.value, this.dateToElem.value)
            } else {
                this.init(target.id);
            }
        }

        this.intervalBtn.onclick = (e) => {
            Filter.activeBtnManager(this.filterBtnElem);
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

    operationActions() {
        this.tBodyElement.onclick = (e) => {
            const target = e.target;

            if (!target.classList.contains('edit-btn') && !target.classList.contains('remove-btn')) {
                return;
            }

            this.operationId = target.parentElement.parentElement.parentElement.getAttribute('id').split('-')[1];

            if (target.classList.contains('edit-btn')) {
                location.href =  "#/edit-operation?operationId=" + this.operationId;
            }
        }

        document.getElementById('success-remove').onclick = () => {
            return this.deleteOperation(this.operationId);
        }

        this.createButtons.onclick = (e) => {
            const target = e.target;

            if (!target.classList.contains('btn')) {
                return;
            }

            if (target.id === 'create-income-operation') {
                location.href = "#/create-operation?operation=income";
            } else {
                location.href = "#/create-operation?operation=expense";
            }
        }
    }

    async deleteOperation(operationId) {
        const result = await CustomHttp.request(config.host + 'operations/' + operationId, 'DELETE');

        if (result && !result.error) {
            const filterButtons = this.filterBtnElem.children;
            for (let i = 0; i < filterButtons.length; i++) {
                if (filterButtons[i].classList.contains('active')) {
                    if (filterButtons[i].id === 'interval') {
                        this.init('interval', this.dateFromElem.value, this.dateToElem.value);
                    } else {
                        this.init(filterButtons[i].id);
                    }
                }
            }
        } else {
            throw new Error(result.error);
        }
    }
}