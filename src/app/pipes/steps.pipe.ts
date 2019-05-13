import { Pipe, PipeTransform } from '@angular/core';
import { Scheduling } from 'src/models/scheduling';

@Pipe({
  name: 'steps'
})
export class StepsPipe implements PipeTransform {

  transform(value: any, element): any {
    if (value === undefined || element === undefined) {
      return;
    }
    this.markSteps(value, element);

  }

  markSteps(value, element) {
    if (value && element.id === 'step1') {
      element.classList.remove("is-active");
      element.classList.add("is-complete");
      element.classList.add("is-active");
    }
    if (value && element.id === 'step2') {
      element.classList.remove("is-active");
      element.classList.add("is-complete");
      element.classList.add("is-active");
    }
    if (value && element.id === 'step3') {
      element.classList.remove("is-active");
      element.classList.add("is-complete");
      element.classList.add("is-active");
    }
    if (value && element.id === 'step4') {
      element.classList.remove("is-active");
      element.classList.add("is-complete");
      element.classList.add("is-active");
    }
  }

}
