# Recreate Deployment Strategy with k6 and Grafana

This document outlines an implementation of the "Recreate" deployment strategy using Docker, k6 for load testing, Prometheus for metric collection, and Grafana for visualization.

## 🚀 Overview of Recreate Strategy

The Recreate deployment strategy involves stopping the old version of an application completely before starting the new one. This results in a period of downtime where the service is unavailable.

**Characteristics:**
-   **Downtime Risk:** High (service is unavailable during the switch).
-   **Rollback:** Easy (just redeploy the old image).

## 🛠️ Implementation Details

### Services

The following services are managed using `docker` commands:

-   **`nginx-v1`**: Represents the old version of the application. It serves a simple HTML page indicating "App v1".
-   **`nginx-v2`**: Represents the new version of the application. It serves a simple HTML page indicating "App v2". This container is started manually during the deployment simulation.
-   **`prometheus`**: Collects metrics from k6.
-   **`grafana`**: Visualizes the collected metrics.
-   **`k6`**: Simulates user traffic to the Nginx service and sends metrics to Prometheus via remote write.

### k6 Test Script (`k6/tests/k6-recreate-test.js`)

The k6 script continuously sends HTTP GET requests to the Nginx service. It includes checks for the HTTP status code and the content of the response body to identify the application version (`v1` or `v2`).

Custom metrics (`app_version` and `app_version_duration`) are used to track which application version is currently serving requests and its response time.

### Grafana Dashboard (`k6/dashboards/grafana-recreate-dashboard.json`)

A custom Grafana dashboard is provided to visualize key metrics during the recreate deployment:

-   **HTTP Request Rate:** Shows the number of requests per second. This will drop to zero during downtime.
-   **HTTP Request Duration (p95):** Displays the 95th percentile of HTTP request duration. This will spike during the transition.
-   **HTTP Request Failures:** Shows the rate of failed requests. This will increase significantly during downtime.
-   **Application Version:** A graph showing which version (`v1` or `v2`) is currently serving traffic.
-   **Application Version Duration (p95):** Displays the 95th percentile of HTTP request duration for each application version.

## 🏃 How to Run the Simulation

1.  **Start the initial services:**
    First, start the `prometheus` and `grafana` services by following the instructions in the `k6/k6.md` file.

    Then, start `nginx-v1`:
```bash
docker run -d --name nginx-v1 -p 8080:80 -v ./recreate-app/index1.html:/usr/share/nginx/html/index.html:ro nginx:latest
```

2.  **Run the k6 load test:**
```bash
docker run --rm --name k6 -v "C:/Users/4artu/IdeaProjects/k8s-deployment-strategies/01-recreate-strategy/tests:/tests:ro" -w //tests -e K6_PROMETHEUS_RW_SERVER_URL=http://host.docker.internal:9999/api/v1/write grafana/k6 run -o experimental-prometheus-rw k6-recreate-test.js
```
    Let this run for at least 30 seconds to establish a baseline in Grafana.

3.  **Observe Grafana (Initial State):**
    Open Grafana at `http://localhost:3000` (login with `admin/admin`). Navigate to the "k6 Recreate Deployment Strategy" dashboard. You should see traffic being served by "App Version v1".

4.  **Perform the "Recreate" deployment:**
    First, stop and remove the old version (`nginx-v1`):
    ```bash
    docker stop nginx-v1 && docker rm nginx-v1
    ```
    Immediately after, start the new version (`nginx-v2`):
    ```bash
    docker run -d --name nginx-v2 -p 8080:80 -v ./recreate-app/index2.html:/usr/share/nginx/html/index.html:ro nginx:latest
    ```

5.  **Observe Grafana (During and After Deployment):**
    Watch the Grafana dashboard. You should observe:
    -   A significant drop in "HTTP Request Rate" to zero.
    -   Spikes in "HTTP Request Duration" and "HTTP Request Failures".
    -   The "Application Version" panel will show a transition from `v1` to `v2`, with a gap during the downtime.

6.  **Cleanup:**
    ```bash
    docker stop prometheus && docker rm prometheus
    docker stop grafana && docker rm grafana
    docker stop nginx-v2 && docker rm nginx-v2
    ```

## 📊 Expected Observations in Grafana

-   **Downtime:** A clear period where "HTTP Request Rate" drops to zero, and "HTTP Request Failures" increase.
-   **Version Transition:** The "Application Version" panel will show `v1` traffic stopping and `v2` traffic starting.
-   **Latency:** "HTTP Request Duration" might show spikes around the deployment window.