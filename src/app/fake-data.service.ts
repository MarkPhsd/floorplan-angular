import { Injectable } from '@angular/core';
import { IFloorPlan } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class FakeDataService {
  constructor() { }
  get floorPlans() {
    const plans = [] as IFloorPlan[];
    const plan = {} as IFloorPlan
    plan.name = 'Dining Area'
    plans.push(plan)
    return plans
  }

}
