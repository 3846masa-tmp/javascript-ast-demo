# @3846masa-tmp/javascript-ast-demo

[技術書典 7][技術書典_7] で頒布した
『[AbemaTV TECH BOOK][abematv_tech_book]』第 1 章
「JavaScript AST から目覚めるぼくらのリファクタリング」のサンプルコードです。

[技術書典_7]: https://techbookfest.org/event/tbf07
[abematv_tech_book]: https://techbookfest.org/event/tbf07/circle/5634582229549056

## 概略

「ES Modules の alias import」を題目に jscodeshift / ESLint / Babel のプラグインを作ることで、 JavaScript AST に触れられるハンズオンです。

---

jscodeshift と ESLint のプラグインでは、alias import を取り除くプラグインを作ります。

<details>
<summary>実際のコード</summary>

**Before**

```js
import { filter as filterRx } from 'rx/operators';
import { handleError } from './error-handler';

subject$
  .pipe(filterRx((value) => !!value))
  .subscribe((value) => console.log(value), handleError);
```

**After**

```js
import { filter } from 'rx/operators';
import { handleError } from './error-handler';

subject$
  .pipe(filter((value) => !!value))
  .subscribe((value) => console.log(value), handleError);
```

</details>

---

Babel のプラグインでは、alias import を使って変数名を短縮する mangle 処理を書きます。

<details>
<summary>実際のコード</summary>

**Before**

```js
import { filter as filterRx } from 'rxjs/operators';
import { isNotUndefined } from 'option-t/lib/Undefinable';
import { handleError } from './error-handler';

subject$
  .pipe(filterRx(isNotUndefined))
  .subscribe((value) => console.log(value), handleError);
```

**After**

```js
import { filter as A } from 'rxjs/operators';
import { isNotUndefined as B } from 'option-t/lib/Undefinable';
import { handleError as C } from './error-handler';
subject$.pipe(A(B)).subscribe((value) => console.log(value), C);
```

</details>
