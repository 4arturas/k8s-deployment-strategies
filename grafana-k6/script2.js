import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 }, // simulate ramp-up of traffic from 1 to 20 virtual users (VUs) over 30 seconds.
    { duration: '1m', target: 20 }, // stay at 20 VUs for 1 minute
    { duration: '20s', target: 0 },  // ramp-down to 0 VUs over 20 seconds
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'http_req_failed{status:400}': ['rate<0.1'], // Less than 10% of 400 status code requests
  },
};

export default function () {
  let res = http.get('http://petclinic.monitoring.svc.cluster.local:80');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}