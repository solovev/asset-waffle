export const waitFor = async (timeout: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
