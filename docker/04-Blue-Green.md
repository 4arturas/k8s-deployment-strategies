# Blue-Green Deployment Strategy


@startuml
title Blue-Green: two environments, instant switch
"[Blue: app-v1]" --> "[Switch]" : traffic cut-over
"[Switch]" --> "[Green: app-v2]" : route all traffic
@enduml

---

## ✅ Overview
The **Blue-Green** strategy runs **two identical environments**:
- **Blue** = current production (old version)
- **Green** = new version, fully deployed but idle
  Traffic is switched from Blue to Green in one step.  
  **Downtime risk:** Zero (if readiness checks pass).  
  **Rollback:** Instant (switch back to Blue).  
  **Ideal for:** Major version upgrades, DB schema changes, compliance-sensitive apps.

---

## Step 1: Start Blue Environment (Old Version)

```sh
docker run -d --name app-blue -p 8081:80 \
-v "C:\U1\podman\ngnix\index.html:/usr/share/nginx/html/index.html:Z" \
art.lpb.baltic.seb.net/dev-docker/nginx:latest
```

---

## Step 2: Start Green Environment (New Version)
```sh
docker run -d --name app-green -p 8082:80 \
  -v "C:\U1\podman\ngnix\index2.html:/usr/share/nginx/html/index.html:Z" \
  art.lpb.baltic.seb.net/dev-docker/nginx:latest
```

---

## Step 3: Configure Nginx as a Switch
Create `nginx.conf`:
````
events {}
http {
upstream active {
# Initially point to Blue
server host.containers.internal:8081;
# To switch, comment Blue and enable Green
# server host.containers.internal:8082;
}
server {
listen 8080;
location / {
proxy_pass http://active;
}
}
}
````
Run Nginx:
```sh
docker run -d --name lb -p 8080:8080 \
  -v "C:\U1\podman\ngnix\nginx.conf:/etc/nginx/nginx.conf:Z" \
  nginx:latest
```

Test:
```sh
curl http://localhost:8080
```

---

## Step 4: Switch Traffic to Green
Edit `nginx.conf`:

upstream active {
# server host.containers.internal:8081; # Blue (old)
server host.containers.internal:8082;   # Green (new)
}
```

Reload Nginx:
```sh
docker exec lb nginx -s reload
```

---

### ✅ Result
Traffic instantly moves from Blue to Green.  
Rollback = just switch back to Blue and reload Nginx.

---

## Optional Enhancements
- Automate switch with a script or CI/CD pipeline.
- Add health checks before switching.
- Use DNS or service mesh for production-grade cut-over.

---

## Useful Commands
```sh
docker ps
````
```sh
docker logs lb
```
