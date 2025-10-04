
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://my-app.default.svc.cluster.local');
  sleep(1);
}
