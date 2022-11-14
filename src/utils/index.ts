const isNested = (entry: any[]) => {
  for (const elem of entry) {
    if (Array.isArray(elem)) return true;
  }

  return false;
};

const isObject = (value: unknown) => {
  return typeof value === 'object';
};

const toCamelCase = (a: string, b: string) => {
  return (
    a +
    b
      .split('')
      .map((char: string, i: number) => (i === 0 ? char.toUpperCase() : char))
      .join('')
  );
};

const flattenLocation = (object: object) => {
  const inner = (node: any): any[] =>
    Object.entries(node).map(([key, value]) =>
      isObject(value) ? inner(value) : [key, value]
    );

  const temp = inner(object);
  const keys = Object.keys(object);
  const result: any[] = [];

  temp.forEach((elem, i) => {
    if (!isNested(elem)) {
      result.push(elem);
      return;
    }

    const entry = elem.map(([key, value]: any) => {
      const prefix = keys[i];
      const header = toCamelCase(prefix, key);
      return [header, value];
    });

    result.push(...entry);
  });

  return Object.fromEntries(result);
};

export { flattenLocation };
