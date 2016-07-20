import debounce from 'throttle-debounce/debounce';

import * as idGenerator from '../../../common/id-generator';

import snFetch from '../fetch';

const DELAY = 3000;
const uid = idGenerator.uid();

function doNotTrack() {
    const {navigator, doNotTrack} = window;
    return navigator.doNotTrack || navigator.msDoNotTrack || doNotTrack;
}

function getData(content = {}) {
    const {availHeight, innerWidth, innerHeight} = window;

    return {
        id: uid,
        innerWidth,
        innerHeight,
        availHeight,
        ...content
    };
}

function send(content = {}) {
    if (doNotTrack()) {
        return;
    }

    snFetch.postJSON('/stats', getData(content));
}

function beaconSend(content = {}) {
    if (doNotTrack() || !navigator.sendBeacon) {
        return;
    }

    const data = getData(content);
    navigator.sendBeacon('/stats', JSON.stringify(data));
}

export const postStats = debounce(DELAY, send);
export const beaconStats = beaconSend;
