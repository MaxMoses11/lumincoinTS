import {RemoveActive} from "../utils/remove-active";
import {Filter} from "../services/filter";
import {HtmlBlocks} from "../utils/html-blocks";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {CalcBalance} from "../services/calc-balance";
import {OperationResponseType} from "../types/operation-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Operations {
    private operations: OperationResponseType[] | undefined;
    private operationId: number | null = null;

    private tBodyElement: HTMLElement | null = document.getElementById('tbody');
    private filterBtnElem: HTMLElement | null = document.getElementById('filter-buttons');
    readonly dateFromElem: HTMLInputElement | null;
    readonly dateToElem: HTMLInputElement | null;
    private intervalBtn: HTMLElement | null = document.getElementById('interval');
    private createButtons: HTMLElement | null = document.getElementById('create-buttons');

    constructor() {
        this.dateFromElem = document.getElementById('date-from') as HTMLInputElement;
        this.dateToElem = document.getElementById('date-to') as HTMLInputElement; 
        RemoveActive.remove();
        const operationsElement: HTMLElement | null = document.getElementById('operations');
        if (operationsElement) {
            operationsElement.classList.add('active');
        }
        const dayElement: HTMLElement | null = document.getElementById('day');
        if (dayElement) {
            dayElement.classList.add('active');
        }

        this.init();

        this.filterActions();

        this.operationActions();
    }

    private async init(period?: string, dateFrom?: string, dateTo?: string): Promise<void> {
        this.operations = await Filter.getOperations(period, dateFrom, dateTo);
        if (this.operations) {
            this.operations.sort((a, b) => a.id - b.id);
        }
        this.buildOperationsTable();
        await CalcBalance.getBalance();
    }

    private buildOperationsTable(): void {
        if (!this.operations) return;

        const that: Operations = this;
        if (this.tBodyElement) {
            this.tBodyElement.innerHTML = '';
        }

        this.operations.forEach((item: OperationResponseType) => {
            const trElem: HTMLElement = document.createElement('tr');
            trElem.setAttribute('id', 'operation-' + item.id);

            const thElem: HTMLElement = document.createElement('th');
            thElem.setAttribute('scope', 'row');
            thElem.innerText = item.id.toString();

            const tdTypeElem: HTMLElement = document.createElement('td');
            if (item.type === 'income') {
                tdTypeElem.classList.add('text-success');
                tdTypeElem.innerText = 'доход';
            } else {
                tdTypeElem.classList.add('text-danger');
                tdTypeElem.innerText = 'расход';
            }

            const tdCategoryElem: HTMLElement = document.createElement('td');
            if (item.category) {
                tdCategoryElem.innerText = item.category;
            } else {
                tdCategoryElem.innerText = 'Не назначено';
            }


            const tdAmountElem: HTMLElement = document.createElement('td');
            tdAmountElem.innerText = item.amount + '$';

            const tdDateElem: HTMLElement = document.createElement('td');
            tdDateElem.innerText = item.date;

            const tdCommentElem: HTMLElement = document.createElement('td');
            tdCommentElem.innerText = item.comment;

            const tdIconsElem: HTMLElement = document.createElement('td');
            tdIconsElem.innerHTML = HtmlBlocks.icons;

            trElem.appendChild(thElem);
            trElem.appendChild(tdTypeElem);
            trElem.appendChild(tdCategoryElem);
            trElem.appendChild(tdAmountElem);
            trElem.appendChild(tdDateElem);
            trElem.appendChild(tdCommentElem);
            trElem.appendChild(tdIconsElem);

            if (that.tBodyElement) {
                that.tBodyElement.appendChild(trElem);
            }
        });
    }

    private filterActions(): void {
        if (!this.filterBtnElem) return;
        const dateInputs: (HTMLInputElement | null)[] = [
            this.dateFromElem,
            this.dateToElem
        ];

        this.filterBtnElem.onclick = (event): void => {
            let target: any = event.target;

            if (!target) return;
            if (!target.classList.contains('btn') || target.id === 'interval') {
                return;
            }
            dateInputs.forEach(item => {
                (item as HTMLInputElement).setAttribute('disabled', 'disabled');
                (item as HTMLInputElement).value = '';
            });
            if (this.filterBtnElem) {
                Filter.activeBtnManager(this.filterBtnElem);
            }
            target.classList.add('active');
            if (this.dateFromElem && this.dateToElem && this.dateFromElem.value && this.dateToElem.value) {
                this.init(target.id, (this.dateFromElem as HTMLInputElement).value, this.dateToElem.value)
            } else {
                this.init(target.id);
            }
        }

        if (this.intervalBtn) {
            this.intervalBtn.onclick = (e): void => {
                const target: any = e.target;
                if (this.filterBtnElem) {
                    Filter.activeBtnManager(this.filterBtnElem);
                }
                dateInputs.forEach(item => (item as HTMLInputElement).removeAttribute('disabled'));
                if (target) {
                    target.classList.add('active');
                }
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

    operationActions() {
        if (!this.tBodyElement) return;
        this.tBodyElement.onclick = (e): void => {
            const target: any = e.target;

            if (!target.classList.contains('edit-btn') && !target.classList.contains('remove-btn')) {
                return;
            }

            this.operationId = target.parentElement.parentElement.parentElement.getAttribute('id').split('-')[1];

            if (target.classList.contains('edit-btn')) {
                location.href = "#/edit-operation?operationId=" + this.operationId;
            }
        }

        const successRemoveElem: HTMLElement | null = document.getElementById('success-remove');
        if (successRemoveElem) {
            successRemoveElem.onclick = () => {
                return this.deleteOperation(this.operationId);
            }
        }

        if (this.createButtons) {
            this.createButtons.onclick = (e): void => {
                const target: any = e.target;

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
    }

    private async deleteOperation(operationId: number | null): Promise<void> {
        const result: DefaultResponseType = await CustomHttp.request(config.host + 'operations/' + operationId, 'DELETE');

        if (result && !result.error) {
            if (!this.filterBtnElem || !this.dateFromElem || !this.dateToElem) return;
            const filterButtons: HTMLCollection = this.filterBtnElem.children;
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
            throw new Error(result.message);
        }
    }
}