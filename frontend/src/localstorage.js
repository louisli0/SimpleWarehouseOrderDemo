export const loadState = () => {
  try {
    const state = localStorage.getItem('state');
    if (state === null) {
      return undefined;
    }
    return JSON.parse(state);
  } catch {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const stringState = JSON.stringify(state);
    localStorage.setItem('state', stringState);
  } catch (err) {
    console.error('Failed to save state', err);
  }
};
