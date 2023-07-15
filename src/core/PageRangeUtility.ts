/**
 * PageRangeUtility class
 * This class is responsible for handling consistency 
 * of page ranges in the text field and array of objects.
 * 
 * @param pageCount - number of pages in the document
 * @param textRange - string that represents page ranges in the text field
 * @param ranges - array of objects that represents page ranges
 * 
 * @function setPageCount() - sets the number of pages in the document
 * @function setTextRange() - sets the text range
 * @function setRanges() - sets the array of objects
 * @function getRanges() - returns the array of objects
 * @function getTextRange() - returns the text range
 * @function textRangeIsCorrect() - checks if the text range is correct
 * 
 */
export default class PageRangeUtility {

    textRangeIsCorrect(textRange: string, pageCount: number): boolean {
        // ignore the testing when empty
        if (textRange.length === 0) {
            return true;
        }

        // remove all spaces
        textRange = textRange.replace(" ", "");

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
        }
        return true;
    };

    // function that updates text ranges from array of objects
    updateTextRange(ranges: [number, number][]) {
        let textRange = "";

        // iterate over an range array
        for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
            let range = ranges[rangeIndex];

            if (range[0] === range[1]) {
                textRange += `${range[0]},`;
            } else if (range[0] > range[1]) {
                range = [range[1], range[0]];
                textRange += `${range[0]}-${range[1]},`;
            } else {
                textRange += `${range[0]}-${range[1]},`;
            }
        }
        // remove last comma
        return textRange.slice(0, -1).replace(" ", "");
    };

    // function that updates array ranges from text range
    updateRanges(textRange: string, pageCount: number) {
        if (!this.textRangeIsCorrect(textRange, pageCount)) return null;

        // remove all ranges when text is deleted
        if (textRange.length === 0) return [];

        // remove all spaces
        textRange = textRange.replace(" ", "");

        // separate the ranges
        const ranges = textRange.split(",");
        // iterate over an range array
        const updatedRanges = [];
        for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
            let range = ranges[rangeIndex];

            // separate range to two numbers
            const rangeNumbers = range.split("-");

            // if rangeNumbers has only one element, it's a single number
            if (rangeNumbers.length === 1) {
                const number = parseInt(rangeNumbers[0]);
                updatedRanges.push([number, number]);

            } else if (rangeNumbers.length !== 2) {
                updatedRanges.push([0, 0]);

            } else {
                // check if the numbers are correct
                const firstNumber = parseInt(rangeNumbers[0]);
                const secondNumber = parseInt(rangeNumbers[1]);
                if (firstNumber > secondNumber) {
                    updatedRanges.push([secondNumber, firstNumber]);
                } else {
                    updatedRanges.push([firstNumber, secondNumber]);
                }
            }
        }
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


