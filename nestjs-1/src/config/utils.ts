export function camelCase(str: string, firstCapital: boolean = false): string {
  return str.replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2, offset) => {
    if (firstCapital === true && offset === 0) {
      return p1;
    }
    if (p2) {
      return p2.toUpperCase();
    }
    return p1.toLowerCase();
  });
}

export function snakeCase(str: string) {
  return str
    .replace(/(?:([a-z])([A-Z]))|(?:((?!^)[A-Z])([a-z]))/g, '$1_$3$2$4')
    .toLowerCase();
}

const isArray = (a: any) => {
  return Array.isArray(a);
};

const isObject = (o: any) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const toCamel = (s: any) => {
  return s.replace(/([-_][a-z])/gi, ($1: any) => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const keysToCamel = (o: any) => {
  if (isObject(o)) {
    const n: any = {};

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i);
    });
  }

  return o;
};
