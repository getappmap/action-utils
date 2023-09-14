export async function waitFor(
  message: string,
  test: () => boolean | Promise<boolean>,
  timeout = 30000
): Promise<void> {
  const startTime = Date.now();
  let delay = 100;

  let exception: Error | undefined;
  let result: boolean | undefined;

  const check = async () => {
    try {
      result = await test();
      return result;
    } catch (e) {
      exception = e as Error;
      return false;
    }
  };

  while (!(await check())) {
    const elapsed = Date.now() - startTime;
    if (elapsed > timeout) {
      if (exception) throw exception;
      else throw new Error(message);
    }

    delay = delay * 2;
    console.log(`Waiting ${delay}ms because: ${message}`);
    await wait(delay);
  }
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
