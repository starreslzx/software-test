describe('Delta', () => {
  it('inserts an object with a zero length property as embed data', () => {
    const up = (levels: number) => '../'.repeat(levels);

    const candidatePaths: string[] = [];
    for (const levels of [9, 10, 11, 12, 13]) {
      candidatePaths.push(up(levels) + 'subject_repositories/delta/src/Delta.ts');
      candidatePaths.push(up(levels) + 'subject_repositories/delta/src/Delta');
      candidatePaths.push(up(levels) + 'repositories/delta/src/Delta.ts');
      candidatePaths.push(up(levels) + 'delta/src/Delta.ts');
    }
    candidatePaths.push(up(3) + 'src/Delta.ts');
    candidatePaths.push(up(3) + 'src/Delta');
    candidatePaths.push(up(2) + 'src/Delta.ts');
    candidatePaths.push('./src/Delta.ts');

    let DeltaClass: any;
    for (const candidatePath of candidatePaths) {
      try {
        const loadedModule: any = jest.requireActual(candidatePath);
        const possibleClass =
          loadedModule && (loadedModule.default ?? loadedModule);
        if (typeof possibleClass === 'function') {
          DeltaClass = possibleClass;
          break;
        }
      } catch (error) {
        // Try the next candidate location.
      }
    }

    if (typeof DeltaClass !== 'function') {
      throw new Error('Unable to locate the Delta implementation to test.');
    }

    const delta = new DeltaClass();
    delta.insert({ length: 0 });

    expect(delta.ops).toEqual([{ insert: { length: 0 } }]);
  });
});