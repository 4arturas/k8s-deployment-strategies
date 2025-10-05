# Argo CD Deployment with k6 Performance Testing

This document outlines the steps to deploy an application using Argo CD and perform load testing with k6, with metrics sent to Prometheus and visualized in Grafana.

## 1. Install argocd
```bash
kubectl create namespace argocd
```
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
```sh
kubectl -n argocd get pods
```
```bash
kubectl apply -n argocd -f argocd-ingress.yaml
```
```sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

https://argocd.local

## 2. Monitoring Setup (Prometheus and Grafana)

To set up Prometheus and Grafana for monitoring, navigate to the root directory and apply the Kubernetes manifest files located in the `monitoring` folder:

```bash
kubectl apply -f ../monitoring/prometheus.yaml
````
```bash
kubectl apply -f ../monitoring/grafana.yaml
kubectl apply -f ../monitoring/grafana-dashboard-k8s-cluster-overview.yaml
kubectl apply -f ../monitoring/grafana-dashboard-provisioning.yaml
```
```sh
kubectl -n monitoring get pods -w
```

http://grafana.local/
http://prometheus.local

```bash
kubectl delete namespace monitoring
````