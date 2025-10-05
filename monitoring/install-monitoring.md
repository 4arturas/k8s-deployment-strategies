# Install Prometheus and Grafana (IBM Guide)

This document provides instructions on how to install Prometheus and Grafana on a Kubernetes cluster, based on the [IBM Documentation](https://www.ibm.com/docs/en/txseries/11.1.0?topic=grafana-installing-prometheus-in-kubernetes-cluster).

## Manual Deployment with YAML

You can use the following YAML manifests for a manual installation.

### 1. Apply the manifests

```sh
kubectl apply -f prometheus.yaml
````
```sh
kubectl apply -f grafana.yaml
```

```sh
kubectl ns monitoring
```


### 2. Access the dashboards

**Note:** You will need an Ingress Controller (e.g., NGINX Ingress Controller) installed in your cluster. You may also need to update the `host` in the Ingress YAML files to match your environment and configure your local `/etc/hosts` file or DNS to resolve the hostnames to the IP address of your Ingress controller.

Once the Ingress resources are created and your DNS is configured, you can access the dashboards in your browser at:

*   Prometheus: [http://prometheus.local](http://prometheus.local)
*   Grafana: [http://grafana.local](http://grafana.local)