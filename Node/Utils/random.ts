var numericDigits : number = 100000000;

export function getRandomNumber(min, max) : number {
    return Math.random() * (max - min) + min;
}

export function getRandomCode() : number {
    return  getRandomNumber(numericDigits, numericDigits*9);
}