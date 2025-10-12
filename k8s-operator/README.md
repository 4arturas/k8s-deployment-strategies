```sh
minikube config set memory 6000 && minikube start && minikube addons enable ingress && minikube addons enable ingress-dns && minikube tunnel
````
```sh
minikube stop && minikube delete --all
````
```sh
docker system prune -af
````
```sh
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && helm repo update && kubectl create ns monitoring && kubectl config set-context --current --namespace=monitoring
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
```sh
helm repo add grafana https://grafana.github.io/helm-charts && helm repo update && helm install k6-operator grafana/k6-operator -n k6-operator --create-namespace
````
```sh
kubectl get all -n k6-operator
````
```sh
kubectl config set-context --current --namespace=monitoring
````
```sh
kubectl logs -f -n k6-operator -l app.kubernetes.io/name=k6-operator
````
```sh
kubectl get events -n monitoring --sort-by=.metadata.creationTimestamp
````
```sh
kubectl create configmap k6-test-script --from-file=k6-prometheus-test.js
````
```sh
kubectl apply -f k6-prometheus-test.yaml
````
```sh
kubectl get testruns -n monitoring
````
```sh
kubectl get pods -l k6_cr=k6-prometheus-test -w
````