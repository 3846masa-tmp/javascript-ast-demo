import { filter as filterRx } from 'rxjs/operators';
import { isNotUndefined } from 'option-t/lib/Undefinable';
import { handleError } from './error-handler';

subject$
  .pipe(filterRx(isNotUndefined))
  .subscribe((value) => console.log(value), handleError);
