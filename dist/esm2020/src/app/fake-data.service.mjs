import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class FakeDataService {
    constructor() { }
    get floorPlans() {
        const plans = [];
        const plan = {};
        plan.name = 'Dining Area';
        plans.push(plan);
        return plans;
    }
}
FakeDataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FakeDataService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FakeDataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FakeDataService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: FakeDataService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2Zha2UtZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTTNDLE1BQU0sT0FBTyxlQUFlO0lBQzFCLGdCQUFnQixDQUFDO0lBQ2pCLElBQUksVUFBVTtRQUNaLE1BQU0sS0FBSyxHQUFHLEVBQWtCLENBQUM7UUFDakMsTUFBTSxJQUFJLEdBQUcsRUFBZ0IsQ0FBQTtRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQTtRQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2hCLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQzs7NkdBUlUsZUFBZTtpSEFBZixlQUFlLGNBRmQsTUFBTTs0RkFFUCxlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElGbG9vclBsYW4gfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGYWtlRGF0YVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBnZXQgZmxvb3JQbGFucygpIHtcbiAgICBjb25zdCBwbGFucyA9IFtdIGFzIElGbG9vclBsYW5bXTtcbiAgICBjb25zdCBwbGFuID0ge30gYXMgSUZsb29yUGxhblxuICAgIHBsYW4ubmFtZSA9ICdEaW5pbmcgQXJlYSdcbiAgICBwbGFucy5wdXNoKHBsYW4pXG4gICAgcmV0dXJuIHBsYW5zXG4gIH1cblxufVxuIl19