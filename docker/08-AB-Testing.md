# A/B Testing Deployment Strategy


@startuml
title A/B Testing: route by user attributes
"[client A]" --> "[blue: app-v1]" : header/cookie → A
"[client B]" --> "[green: app-v2]" : header/cookie → B
@enduml

---

## ✅ Overview
**A/B Testing** routes traffic based on **user attributes** (e.g., cookies, headers, segments) rather than random percentages. Unlike canary, which is percentage-based, A/B testing ensures **specific cohorts** always hit a given version.  
**Downtime risk:** Very low.  
**Rollback:** Moderate (must retire cohorts).  
**Ideal for:** UX experiments, pricing tests, ML model comparisons.

---

## Step 1: Run Two App Versions
```sh
docker run -d --name app-v1 -p 8081:80 \
  -v "C:\U1\podman\ngnix\index.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
````
```sh
docker run -d --name app-v2 -p 8082:80 \
  -v "C:\U1\podman\ngnix\index2.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
````
---

## Step 2: Configure NGINX for Attribute-Based Routing
Create `nginx-ab.conf`:
```nginx
events {}
http {
    upstream blue  { server host.containers.internal:8081; }
    upstream green { server host.containers.internal:8082; }

    # Map based on cookie or header
    map $http_cookie $variant {
        ~*variant=B   green;
        default       blue;
    }

    server {
        listen 8080;
        location / {
            proxy_pass http://$variant;
        }
    }
}
```

Run the reverse proxy:
```sh
docker run -d --name lb -p 8080:8080 \
  -v "C:\U1\podman\ngnix\nginx-ab.conf:/etc/nginx/nginx.conf:Z" \
  nginx:latest
```

---

## Step 3: Test
- Default (no cookie): should hit **blue**:
```sh
curl http://localhost:8080
```

- With `variant=B` cookie: should hit **green**:
```sh
curl -H "Cookie: variant=B" http://localhost:8080
```

---

### ✅ Result
- Users in **cohort A** (default) see v1.
- Users in **cohort B** (cookie/header) see v2.
- You can add more cohorts or use headers like `X-Experiment-Group`.

---

## Optional Enhancements
- Use **feature flag services** (e.g., LaunchDarkly) for dynamic control.
- Add **analytics** to measure conversion, latency, or errors per cohort.
- Combine with **split_clients** for hybrid A/B + percentage rollout.

---

## Useful Commands

```sh
docker ps
```
```sh
docker logs lb
````
---

## Notes
- Ensure **state isolation**: sessions or DB writes should not leak between variants.
- For ML experiments, log predictions and outcomes separately for each cohort.
