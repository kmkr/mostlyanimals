import debounce from 'debounce';

import * as idGenerator from '../../../common/id-generator';

import snFetch from '../fetch';

const DELAY = 3000;
const uid = idGenerator.uid();

function send(content = {}) {
    const {navigator, doNotTrack} = window;
    if (navigator.doNotTrack || navigator.msDoNotTrack || doNotTrack) {
        return;
    }

    const {innerHeight, innerWidth} = window;

    snFetch.postJSON('/stats', {
        id: uid,
        innerWidth,
        innerHeight,
        ...content
    });
}

export const postStats = debounce(send, DELAY);
