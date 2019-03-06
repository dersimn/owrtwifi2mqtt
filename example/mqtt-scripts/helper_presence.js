const Yatl = require('yetanothertimerlibrary');

const people = {
    'mac-00-00-00-00-00-00': 'Roommate1',
    'mac-00-00-00-00-00-00': 'Roommate2',
    'mac-00-00-00-00-00-00': 'Guest1'
};
var timerList = {};

const timeout = 5 * 60; // 5min

function handleTimeout(mac) {
    if (!(mac in timerList)) {
        timerList[mac] = new Yatl.Timeout(() => {
            setValue('$presence/people/'+people[mac], {
                val: false,
                lastseen: Date.now()
            }, true);
        });
    }

    // (Re)start Timout
    timerList[mac].stop().start(timeout * 1000);
}

subscribe('owrtwifi/status/+/event', {change: true, condition: 'val == "new"'}, (topic, val) => {
    const split = topic.split('/');

    if (split[2] in people) {
        setValue('$presence/people/'+people[split[2]], {
            val: true,
            lastseen: Date.now()
        }, true);
        handleTimeout(split[2]);
    }
});

subscribe('owrtwifi/status/+/lastseen/epoch', (topic, val) => {
    const split = topic.split('/');

    if (split[2] in people) {
        if ((val + timeout)*1000 < Date.now()) {
            setValue('$presence/people/'+people[split[2]], {
                val: false,
                lastseen: val*1000
            }, true);
        } else {
            setValue('$presence/people/'+people[split[2]], {
                val: true,
                lastseen: val*1000
            }, true);
            handleTimeout(split[2]);
        }
    }
});

subscribe('$presence/people/+', () => {
    let count = 0;

    Object.keys(people).forEach(mac => {
        const name = people[mac];

        if (getValue('$presence/people/'+name)) {
            count++;
        }
    });

    setValue('$presence/count', count);
});
