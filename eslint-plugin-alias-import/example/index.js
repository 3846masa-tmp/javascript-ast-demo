import { filter as filterRx } from 'rx/operators';
import { handleError } from './error-handler';

subject$
  .pipe(filterRx((value) => !!value))
  .subscribe((value) => console.log(value), handleError);
