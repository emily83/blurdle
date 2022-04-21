const { format } = require('date-fns');

exports.formatDate = function(date) {
    if (date) {
        const dt = new Date(date);
        return format(dt, 'E dd MMM yyyy');
        //=> '02/11/2014'
    } else {
        return 'Unknown';
    }
}

exports.formatDuration = function(duration) {
    if (duration) {
        return  (duration/60).toFixed(2) + ' hrs';
    } else {
        return 'Unknown';
    }
}

exports.formatStatus = function(status) {
    switch (status) {
        case 'notStarted':
            return 'Not started';
        case 'inProgress':
            return 'In progress';
        case 'complete':
            return 'Complete';
        default:
            return 'Unknown';
    }
}