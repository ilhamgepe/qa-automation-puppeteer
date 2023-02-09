export async function delay(milisecond: number): Promise<void> {
  await new Promise((r) => setTimeout(r, milisecond));
}
