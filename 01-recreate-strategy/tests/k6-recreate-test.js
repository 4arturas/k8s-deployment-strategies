import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
    vus: 5,
    duration: '2m', // Run for 2 minutes to observe the deployment
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
        checks: ['rate>0.99'],
    },
};

const BASE_URL = 'http://host.docker.internal:8080'; // Target the Nginx service within the Docker network
const appVersion = new Counter('app_version');
const appVersionDuration = new Trend('app_version_duration');

export default function () {
    let res = http.get(BASE_URL, {
        tags: { testid: 'recreate-test' },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'body contains v1 or v2': (r) => r.body.includes('v1') || r.body.includes('v2'),
    });

    if (res.body.includes('v1')) {
        appVersion.add(1, { version: 'v1' });
    } else if (res.body.includes('v2')) {
        appVersion.add(1, { version: 'v2' });
    }

    appVersionDuration.add(res.timings.duration, { version: res.body.includes('v1') ? 'v1' : 'v2' });

    sleep(1);
}
