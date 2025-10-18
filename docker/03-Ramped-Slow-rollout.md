# Ramped / Slow Rollout Deployment Strategy

@startuml
title Ramped / Slow Rollout: gradual with pauses
"[app-v1]" --> "[app-v1 + app-v2]" : add new pods slowly
"[app-v1 + app-v2]" --> "[pause]" : manual/metric check
"[pause]" --> "[app-v2]" : continue rollout
@enduml

---

## ✅ Overview

The **Ramped (Slow) Rollout** strategy is similar to Rolling Update but introduces **manual or automated pauses** between steps.  

**Downtime risk:** Very low (at least one old instance stays up).  

**Rollback:** Easy (stop rollout and revert).  

**Ideal for:** Mission-critical apps where metrics must be validated before proceeding.

---

## Step 1: Start Two Old Version Instances

docker run -d --name app-v1-1 -p 8081:80 \

-v "C:\U1\podman\ngnix\index.html:/usr/share/nginx/html/index.html:Z" \

art.lpb.baltic.seb.net/dev-docker/nginx:latest

docker run -d --name app-v1-2 -p 8082:80 \

-v "C:\U1\podman\ngnix\index.html:/usr/share/nginx/html/index.html:Z" \

art.lpb.baltic.seb.net/dev-docker/nginx:latest

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

## Step 3: Replace One Old Instance with New Version

```sh

docker stop app-v1-1 && docker rm app-v1-1
docker run -d --name app-v2-1 -p 8081:80 \

-v "C:\U1\podman\ngnix\index2.html:/usr/share/nginx/html/index.html:Z" \

art.lpb.baltic.seb.net/dev-docker/nginx:latest

```

---

## Step 4: **Pause and Validate**

- Check metrics, logs, and health before continuing:

```sh

curl http://localhost:8080

docker logs lb

```

---

## Step 5: Replace Remaining Old Instance

```sh

docker stop app-v1-2 && docker rm app-v1-2
docker run -d --name app-v2-2 -p 8082:80 \

  -v "C:\U1\podman\ngnix\index2.html:/usr/share/nginx/html/index.html:Z" \

  art.lpb.baltic.seb.net/dev-docker/nginx:latest

```

---

### ✅ Result

Traffic remains available during rollout. Manual pauses reduce risk but require human intervention.

---

## Optional Enhancements

- Automate pauses with scripts or CI/CD gates.

- Add health checks before resuming rollout.

- Use metrics dashboards for decision-making.

---

## Useful Commands

```sh

docker ps

docker logs lb

```