// script.js
// Minimal k6 smoke test with a couple of checks and sane defaults.
// Works with any k6 output (JSON/InfluxDB/Prometheus Remote Write).
// BASE_URL and TEST_ID can be overridden via env vars.
//
// Run docs: https://grafana.com/docs/k6/latest/get-started/running-k6/
// Outputs docs: https://grafana.com/docs/k6/latest/get-started/results-output/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
    // Small, quick test by default; adjust as you wish
    vus: 5,
    duration: '30s',

    thresholds: {
        // Fail the test if more than 1% requests fail
        http_req_failed: ['rate<0.01'],
        // Keep p(95) latency under 500ms
        http_req_duration: ['p(95)<500'],
        // Ensure at least 99% of checks pass
        checks: ['rate>0.99'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';
const TEST_ID  = __ENV.TEST_ID  || 'local-dev'; // useful to filter in Grafana

// Custom metric for demonstration
const myCustomTrend = new Trend('my_custom_trend');

export default function () {
    // Request 1: Basic GET request to root
    let res1 = http.get(`${BASE_URL}/`, {
        tags: { testid: TEST_ID, endpoint: 'root_page' },
    });

    check(res1, {
        'GET / status is 200': (r) => r.status === 200,
        'GET / body is not empty': (r) => (r.body || '').length > 0,
    });

    // Request 2: Another GET request to root with different tag
    let res2 = http.get(`${BASE_URL}/`, {
        tags: { testid: TEST_ID, endpoint: 'another_root_page' },
    });

    check(res2, {
        'GET / (another) status is 200': (r) => r.status === 200,
        'GET / (another) body is not empty': (r) => (r.body || '').length > 0,
    });

    // Request 3: Simulate a failed request (404)
    let res3 = http.get(`${BASE_URL}/status/404`, {
        tags: { testid: TEST_ID, endpoint: 'not_found' },
    });

    check(res3, {
        'GET /status/404 status is 404': (r) => r.status === 404,
    });

    // Add a value to the custom trend metric (using duration of res1)
    myCustomTrend.add(res1.timings.duration);

    // tiny think-time so we don't hammer constantly
    sleep(1);
}
