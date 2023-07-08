export interface RangeType {
    start: number;
    end: number;
}

export default class PageRange {
    textRange: string;
    ranges: RangeType[];

    constructor() {
        this.textRange = "";
        this.ranges = [];
    }

    textRangeIsCorrect(textRange: string, pageCount: number): boolean {
        // ignore the testing when empty
        if (textRange.length === 0) {
            return true;
        }

        // check for correct format:
        // {number}-{number}, {number}, {number}-{number},
        // we don't want to allow any other characters
        // we don't want the comma at the end so it's going to be added later
        const foundCorrectForm = new RegExp(/^([0-9]+(-[0-9]+){0,1},)*$/g).test(
            textRange + ","
        );

        // separate the ranges
        if (!foundCorrectForm) {
            return false;
        }
        const ranges = textRange.split(",");
        // check if the ranges are correct
        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            // separate range to two numbers
            const rangeNumbers = range.split("-");

            // if rangeNumbers has only one element, it's a single number
            if (rangeNumbers.length === 1) {
                const number = parseInt(rangeNumbers[0]);
                if (number < 1 || number > pageCount) {
                    return false;
                }
            } else if (rangeNumbers.length !== 2) {
                return false;
            }
            // check if the numbers are correct
            const firstNumber = parseInt(rangeNumbers[0]);
            const secondNumber = parseInt(rangeNumbers[1]);
            if (firstNumber > secondNumber) {
                return false;
            }

            if (firstNumber < 1 || secondNumber > pageCount) {
                return false;
            }

            // I think we can ignore this one
            // if (firstNumber === secondNumber) {
            //   return false;
            // }
        }
        return true;
    };

    // function that appends text range from slider values
    updateTextRange() {
        let textRange = "";

        // iterate over an range array
        for (let rangeIndex = 0; rangeIndex < this.ranges.length; rangeIndex++) {
            let range = this.ranges[rangeIndex];

            if (range.start === range.end) {
                textRange += `${range.start},`;
            } else if (range.start > range.end) {
                range = { start: range.end, end: range.start };
                textRange += `${range.start}-${range.end},`;
            } else {
                textRange += `${range.start}-${range.end},`;
            }
        }
        // remove last comma
        return textRange.slice(0, -1);
    };

    updateRanges() {
        console.log("updateRanges", this.textRange);
        // separate the ranges
        const ranges = this.textRange.split(",");
        // iterate over an range array
        const updatedRanges = [];
        for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
            let range = ranges[rangeIndex];

            // separate range to two numbers
            const rangeNumbers = range.split("-");

            // if rangeNumbers has only one element, it's a single number
            if (rangeNumbers.length === 1) {
                const number = parseInt(rangeNumbers[0]);
                updatedRanges.push({ start: number, end: number });
                // ranges[rangeIndex] = { start: number, end: number };
            } else if (rangeNumbers.length !== 2) {
                // return;
                updatedRanges.push({ start: 0, end: 0 });
                // ranges[rangeIndex] = { start: 0, end: 0 };
            } else {
                // check if the numbers are correct
                const firstNumber = parseInt(rangeNumbers[0]);
                const secondNumber = parseInt(rangeNumbers[1]);
                if (firstNumber > secondNumber) {
                    updatedRanges.push({ start: secondNumber, end: firstNumber });
                    // ranges[rangeIndex] = { start: secondNumber, end: firstNumber };
                } else {
                    updatedRanges.push({ start: firstNumber, end: secondNumber });
                    // ranges[rangeIndex] = { start: firstNumber, end: secondNumber };
                }
            }
        }
        console.log("updatedRanges", updatedRanges);
        return updatedRanges;
    };

    // create function generateRange() that generates sequence of numbers from 1 to pageCount
    // step will be based on pageCount divided by 2
    generateRange(pageCount: number) {
        const separator = pageCount <= 10 ? pageCount : pageCount / 5;
        const step = Math.ceil(pageCount / separator);
        let range = [];
        let command: number;
        range.push(1);
        for (let i = 1; i <= pageCount; i += step) {
            command = i + step - 1;

            if (command > pageCount) {
                command = pageCount;
            }
            range.push(command);
        }
        return range;
    };
}


