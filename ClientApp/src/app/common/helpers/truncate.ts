const truncate = (str: string | undefined): string => {
  if (!str) {
    return '';
  }

  return str.length > 40 ? str.substring(0, 37) + '...' : str;
};

export default truncate;
