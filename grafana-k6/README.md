# Grafana K6
Below Steps will help to create a Grafana using Kube-Prometheus-Stack Operator

# 1. Install Kube-Prometheus-Stack on Cluster:
Reference Documentation is as below:

https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack

This will installs the kube-prometheus stack, a collection of Kubernetes manifests, Grafana dashboards, and Prometheus rules combined with documentation and scripts to provide easy to operate end-to-end Kubernetes cluster monitoring with Prometheus using the Prometheus Operator.

Below Steps needs to be followed:
```sh
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
````
```sh
helm repo update
````
```sh
kubectl create ns monitoring
````
```sh
kubectl config set-context --current --namespace=monitoring
````
```sh
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack -n monitoring -f values.yaml
````
```sh
kubectl port-forward svc/monitoring-grafana 3000:80
````
```sh
kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 -d
````

# 2. Install the application
```sh
kubectl apply -f petclinic.yaml
````

# 3. Configure the load Tests

```sh
kubectl create configmap k6-script --from-file=script.js
````
```sh
kubectl apply -f k6-job.yaml
````


```sh
kubectl create configmap k6-script2 --from-file=script2.js
````
```sh
kubectl apply -f k6-job2.yaml
````

```sh
kubectl get pods
````
```sh
kubectl logs pod/k6-load-test-qdmdq
````

```sh
kubectl get svc
````
```sh
kubectl port-forward svc/petclinic 8080:80
````

# 4. Import K6 Promethues Dashboard
Import k6 Dashboard:
Go to + > Import

ID: 19665
ID: 1860

# 5. Validate the metrics on Grafana
To Search all of the time series data points grouping by job  in query

    count({__name__=~".+"}) by (job)

# 6. Configure the load Tests
```sh
kubectl create configmap k6-script2 --from-file=script2.js
````
```sh
kubectl apply -f k6-job2.yaml
````