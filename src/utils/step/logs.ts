export function success(message: string) {
  console.log(message.green);
}

export function failed(message: string) {
  console.log(message.red);
}
