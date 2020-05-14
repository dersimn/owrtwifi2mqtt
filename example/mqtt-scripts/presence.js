subscribe('$presence/count', {change: true, condition: 'objPrev.val == 0 && val != 0'}, () => { // Exact change from 0 -> (!0)
    log.info('First one arrived at home');

    // ... actual logic here
});

subscribe('$presence/count', {change: true, condition: 'val == 0'}, () => {
    log.info('Everyone left the appartment');

    // ... actual logic here
});


subscribe('$presence/people/Roommate1', {change: true, condition: 'val == true'}, () => {
    log.info('Roommate1 came home');

    // ... actual logic here
});
subscribe('$presence/people/Roommate1', {change: true, condition: 'val == false'}, () => {
    log.info('Roommate1 left');

    // ... actual logic here
});
