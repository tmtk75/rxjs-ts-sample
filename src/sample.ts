import { interval, timer, Observable, from, of } from "rxjs";
import {
  scan,
  zip,
  bufferCount,
  map,
  flatMap,
  reduce,
  tap,
} from "rxjs/operators";

// const p = Observable.timer(0, DELAY)  // Not equal to interval(delay)
// .zip(Observable.from(objs).bufferCount(PARALLEL))
// .map(([, e]) => e)
// .flatMap(chunks => Promise.all(chunks.map(i => save(i))))
// .do(e => bar.tick());
// return p.scan((a, b) => a.concat(b)).toPromise();  // Collect all chunks as an array.

const save = (i: number) => of(i * 10).toPromise();

const delay = 1000 * 0.5;
const objs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
(async () => {
  const p = interval(delay).pipe(
    zip(from(objs).pipe(bufferCount(3))),
    map(([, e]) => e),
    flatMap((chunks) => Promise.all(chunks.map((i) => save(i))))
  );
  p.pipe(scan((a, b) => a.concat(b)))
    .pipe(map((e) => [e.length, e]))
    .subscribe(console.log);
})();
