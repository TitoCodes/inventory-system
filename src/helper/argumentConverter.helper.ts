const booleanConverter = (param: any) => {
  return param != null ? JSON.parse(param) : null;
};

export {
  booleanConverter,
};
