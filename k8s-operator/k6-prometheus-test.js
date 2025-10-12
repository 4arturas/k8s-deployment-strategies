import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Gauge, Rate } from 'k6/metrics';

// Custom metrics
const myTrend = new Trend('waiting_time');
const myCounter = new Counter('my_counter');
const myGauge = new Gauge('my_gauge');
const myRate = new Rate('my_rate');

export const options = {
    stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 10 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.1'],
        'waiting_time': ['p(99)<1000'],
    },
};

export default function () {
    const response = http.get('http://monitoring-kube-petclinic:8080/');

    // Custom metrics
    myTrend.add(response.timings.waiting);
    myCounter.add(1);
    myGauge.add(Math.random() * 100);
    myRate.add(response.status === 200);

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time OK': (r) => r.timings.duration < 1000,
    });

    sleep(0.5);
}