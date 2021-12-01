const { get_current_date_time, format_date } = require("./datetime");

exports.getErrorDetails = (err) => {
    var matches = err.stack.split('\n');
    var regex1 = /\((.*):(\d+):(\d+)\)$/;
    var regex2 = /(.*):(\d+):(\d+)$/;
    var errorArr1 = regex1.exec(matches[1]);
    var errorArr2 = regex2.exec(matches[1]);
    if (errorArr1 !== null || errorArr2 !== null) {
        var errorText = matches[0];
        if (errorArr1 !== null) {
            var errorFile = errorArr1[1];
            var errorLine = errorArr1[2];
        } else if (errorArr2 !== null) {
            var errorFile = errorArr2[1];
            var errorLine = errorArr2[2];
        }
        return ({
            errorText: errorText.replace("Error: Error:", "").trim(),
            errorFile: errorFile.replace('at', '').trim(),
            errorLine: errorLine,
            errorTime:  format_date(get_current_date_time(), 'dd MMMM yyyy HH:mm a')
        });
    }
}
