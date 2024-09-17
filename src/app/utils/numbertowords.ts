// src/app/utils/number-to-words.ts
export function numberToWordsIndian(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const c = ['', 'Hundred', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  let str = '';
  if (Math.floor(num / 10000000) > 0) {
    str += numberToWordsIndian(Math.floor(num / 10000000)) + ' ' + c[4] + ' ';
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    str += numberToWordsIndian(Math.floor(num / 100000)) + ' ' + c[3] + ' ';
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    str += numberToWordsIndian(Math.floor(num / 1000)) + ' ' + c[2] + ' ';
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    str += numberToWordsIndian(Math.floor(num / 100)) + ' ' + c[1] + ' ';
    num %= 100;
  }
  if (num > 0) {
    if (num < 20) {
      str += a[num] + ' ';
    } else {
      str += b[Math.floor(num / 10)] + ' ' + a[num % 10] + ' ';
    }
  }
  return str.trim();
}

export function numberToWordsWithDecimal(num: number): string {
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let words = numberToWordsIndian(integerPart) + ' Rupees';
  if (decimalPart > 0) {
    words += ' and ' + numberToWordsIndian(decimalPart) + ' Paise';
  }

  return words;
}
