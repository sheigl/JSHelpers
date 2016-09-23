interface Formatter 
{
    key: string;
    format(s: string): string;
}
module StringUtil {    
    var formatters: Formatter[] = [];
    // currency formatter
    formatters.push({
        key: 'c',
        format: (s: string): string => {
            try {
                var n: number = parseFloat(s);
                n = Math.round(n * 100) / 100;

                if (n > 999) {
                    var nString = n.toString().split('.');
                    var returnString = '';

                    var count = 0;
                    for (var index = nString[0].length - 1; index >= 0; index--) {
                        var element = nString[0].charAt(index);                        
                        count++;
                        returnString = element + returnString;
                        
                        if (count === 3) {
                            returnString = ',' + returnString;
                            count = 0;
                        }
                    }

                    if (nString.length > 1) {
                        returnString = returnString + '.' + nString[1];
                    }

                    return '$' + returnString;
                }
                else {
                    return '$' + n.toString();
                }
            } catch (error) {
                return s;
            }
        }
    });
    
    export function AddFormatters(formatter: Formatter) {
        var indexOfExistingFormatter: number = -1;
        
        for (var index = 0; index < formatters.length; index++) {
            var element = formatters[index];
            if (element.key === formatter.key) {
                indexOfExistingFormatter = index;
                break;
            }
        }

        if (indexOfExistingFormatter !== -1) {
            formatters.splice(indexOfExistingFormatter, 1);
        }

        formatters.push(formatter);
    }
    /** 
     * Similar to String.Format from C# but, replace [0].
     * @param s string template
     * @param params array of objects toString
     * @return formatted string from template
    */
    export function Format(s: string, params: any[]): string {
        var returnValue: string = s;   
        
        for (var index = 0; index < params.length; index++) {
            let element = params[index];

            let r: RegExp = new RegExp('\\[' + index + '.{0,2}\\]', 'g');

            if (element) {
                var match = returnValue.match(r);
                
                // formatters
                var firstMatch = match.length > 0 ? match[0] : null;
                var firstMatchArray = firstMatch.split(':');                 
                if (firstMatch && firstMatchArray.length > 1) {
                    var formatKey = firstMatchArray[1].replace(']', '');
                    for (var k = 0; k < formatters.length; k++) {
                        let f = formatters[k];
                        if (f.key.toLowerCase() === formatKey.toLowerCase()) {
                            element = f.format(element);
                            break;
                        }
                    }
                }
                
                returnValue = returnValue.replace(r, '{~{' + element.toString() + '}~}');                             
            }
            else {
                returnValue = returnValue.replace(r, '{~{' + '' + '}~}');
            }
        }
        let leftBracket: RegExp = new RegExp('\{~\{', 'g');
        let rightBracket: RegExp = new RegExp('\}~\}', 'g');

        returnValue = returnValue.replace(leftBracket, '');
        returnValue = returnValue.replace(rightBracket, '');
        
        return returnValue;
    }

    /**
     * Similar to String.IsNullOrEmpty from C#
     * @param s string to check if is null or empty
     * @return boolean
     */
    export function IsNullOrEmpty(s: string): boolean {
        let r: RegExp = new RegExp('\r?\n|\r', 'g'); 
        
        if (typeof s === 'undefined') {
            return true;
        }
        else if (!s) {
            return true;
        }
        else if (s.trim() === '') {
            return true;
        }
        else if (s.replace(r, '').trim() === '') {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Similar to String.Contains from C#
     * @param s string to check
     * @param contains string to find
     * @return boolean
     */
    export function Contains(s: string, contains: string): boolean {
        if (!s) {
            return false;
        }
        else if (s.toLowerCase().indexOf(contains.toLowerCase()) > -1) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Take only specified amount of characters in a string
     * @param s string that is being modified
     * @param n amount of characters to take
     * @param a string to append after taking (optional)
     * @return modified string
     */
    export function Take(s: string, n: any, a: string): string {
        if (typeof s === 'undefined') {
            return null;
        }
        if (typeof n === 'undefined') {
            return null;
        }
        if (!s) {
            return null;
        }
        if (typeof s !== 'string') {
            s = s.toString();
        }
        if (typeof n !== 'number') {
            try {
                n = parseInt(n);
            } catch (error) {
                return null;
            }
        }

        if (n === 0) {
            return s;
        }

        let returnValue: string = '';

        for (var index = 0; index < n; index++) {
            var element = s[index];
            
            if (!element) {
                break;
            }

            returnValue += element;

        }

        if (typeof a !== 'undefined') {
            returnValue += a;
        }

        return returnValue;
    }

    export function ScrubHTML(s: string): string {
        if (!s) {
            return null;
        }

        s = s.replace('<!-- more -->', '');
        s = s.replace('<!--', '');
        s = s.replace('-->', '');

        let e: HTMLElement = document.createElement('div');

        e.innerHTML = s;        

        return e.textContent;
    }

    export function IsValid(s: string, r: string) {
        return s.match(r);
    }    
}