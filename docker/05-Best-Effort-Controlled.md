# Best-Effort Controlled Rollout Deployment Strategy


@startuml
title Best-Effort Controlled: aggressive rolling update
"[app-v1]" --> "[app-v1 + app-v2]" : surge aggressively
"[app-v1 + app-v2]" --> "[app-v2]" : remove old quickly
@enduml

---

## ✅ Overview
The **Best-Effort Controlled Rollout** strategy is a variation of Rolling Update with **aggressive surge and maxUnavailable settings**.  
**Goal:** Speed over strict uptime guarantees.  
**Downtime risk:** Moderate (brief blips possible if load spikes).  
**Rollback:** Easy (similar to rolling update).  
**Ideal for:** Large stateless fleets where speed matters more than perfect availability.

---

## Step 1: Start Multiple Old Version Instances
```sh
docker run -d --name app-v1-1 -p 8081:80 \
  -v "C:\U1\podman\ngnix\index.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
````
```sh
docker run -d --name app-v1-2 -p 8082:80 \
  -v "C:\U1\podman\ngnix\index.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
```

---

## Step 2: Configure Nginx as a Load Balancer
Create `nginx.conf`:
```nginx
events {}
http {
    upstream backend {
        server host.containers.internal:8081;
        server host.containers.internal:8082;
    }
    server {
        listen 8080;
        location / {
            proxy_pass http://backend;
        }
    }
}
```

Run Nginx:
```sh
docker run -d --name lb -p 8080:8080 \
  -v "C:\U1\podman\ngnix\nginx.conf:/etc/nginx/nginx.conf:Z" \
  nginx:latest
```

Test:

curl http://localhost:8080

---

## Step 3: Aggressively Replace Old Instances
Stop both old containers quickly and start new ones:
```sh
docker stop app-v1-1 app-v1-2 && docker rm app-v1-1 app-v1-2
````
```sh
docker run -d --name app-v2-1 -p 8081:80 \
  -v "C:\U1\podman\ngnix\index2.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
````
```sh
docker run -d --name app-v2-2 -p 8082:80 \
  -v "C:\U1\podman\ngnix\index2.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
````
---

### ✅ Result
Update completes fast, but there may be **brief downtime** if both old instances stop before new ones are ready.

---

## Optional Enhancements
- Use **parallel start** scripts to minimize downtime.
- Add **readiness checks** before removing old containers.
- Combine with **load testing** to ensure capacity during surge.

---

## Useful Commands
```sh
docker ps
````
```sh
docker logs lb
```
