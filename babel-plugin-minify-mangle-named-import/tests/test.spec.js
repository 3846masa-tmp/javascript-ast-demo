const test = require('ava');
const babel = require('@babel/core');

const plugin = require('../lib/index');

test('minify-mangle-named-import', (t) => {
  const input = `
    import { filter as filterRx } from 'rxjs/operators';
    import { isNotUndefined } from 'option-t/lib/Undefinable';
    import { handleError } from './error-handler';

    subject$
      .pipe(filterRx(isNotUndefined))
      .subscribe((value) => console.log(value), handleError);
  `;

  const { code } = babel.transform(input, {
    plugins: [plugin],
  });

  t.snapshot(code);
});
