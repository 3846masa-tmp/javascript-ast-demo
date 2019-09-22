const RuleTester = require('eslint').RuleTester;
const { rules } = require('../lib/index');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-alias-import', rules['no-alias-import'], {
  valid: [
    {
      code: `
        import { filter } from 'rxjs/operators';
      `,
    },
    {
      code: `
        import { store as containerStore } from './ContainerStore';

        const store = new Map();
        const id = containerStore.get('id');
      `,
    },
  ],

  invalid: [
    {
      code: `
        import { filter as filterRx } from 'rxjs/operators';
      `,
      output: `
        import { filter } from 'rxjs/operators';
      `,
      errors: [{ message: 'An alias import is not allowed.' }],
    },
    {
      code: `
        import { filter as filterRx } from 'rx/operators';
        import { handleError } from './error-handler';

        subject$.pipe(filterRx((value) => !!value)).subscribe((value) => console.log(value), handleError);
      `,
      output: `
        import { filter } from 'rx/operators';
        import { handleError } from './error-handler';

        subject$.pipe(filter((value) => !!value)).subscribe((value) => console.log(value), handleError);
      `,
      errors: [{ message: 'An alias import is not allowed.' }],
    },
    {
      code: `
        import { store as containerStore } from './ContainerStore';

        const id = containerStore.get('id');

        function createStore() {
          const store = new Map();
          return store;
        }
      `,
      output: `
        import { store } from './ContainerStore';

        const id = store.get('id');

        function createStore() {
          const store = new Map();
          return store;
        }
      `,
      errors: [{ message: 'An alias import is not allowed.' }],
    },
  ],
});
