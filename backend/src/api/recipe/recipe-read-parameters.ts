import QueryString from 'qs';

export type ReadParameters = {
  sort: { target: string; direction: string };
  page: { offset: number; quantity: number };
  terms: string;
  total: number;
};

function parseNumberValue(value: QueryString.ParsedQs[string]): number {
  if (typeof value !== 'string') {
    return 0;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

export function prepareReadParameters(queryString: QueryString.ParsedQs): ReadParameters {
  const response: ReadParameters = {
    sort: { target: 'title', direction: 'asc' },
    page: { offset: 0, quantity: 0 },
    terms: '',
    total: 0,
  };

  if (typeof queryString.t === 'string') {
    response.sort.target = (queryString.t === 'created' || queryString.t === 'updated')
      ? `date_${queryString.t}`
      : queryString.t;
  }

  if (typeof queryString.d === 'string') {
    response.sort.direction = queryString.d.toLowerCase() === 'asc' ? 'asc' : 'desc';
  }

  response.page.offset = parseNumberValue(queryString.o);
  response.page.quantity = parseNumberValue(queryString.q);

  if (typeof queryString.terms === 'string') {
    response.terms = queryString.terms;
  }

  return response;
}
