# k8s

```sh
kubectl delete all --all -namespace
````

```sh
kubectl cluster-info
````


```sh
kubectl get node
````

```sh
kubectl get namespaces
````

```sh
kubectl get pods
````

```sh
kubectl get ns
````

```sh
kubectl get pods -n shopcloud -w
````

```sh
kubectl get pods -n argocd
````

```sh
kubectl apply -f argocd/application.yaml
````

```sh
kubectl delete -f argocd/application.yaml
````

```sh
kubectl delete namespace shopcloud
````

```sh
kubectl delete namespace argocd
````
````

```sh
 kubectl get svc argocd-server -n argocd -o jsonpath='{.spec.ports[?(@.port==443)].nodePort}'
````
username: admin
password:
```sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
````

```sh
kubectl delete namespace kafka_network
````



# Kubernetes Log Commands

To check the logs of each service in the `shopcloud` namespace, use the following commands:

```bash
kubectl logs deployment/api-gateway -n shopcloud
```
```bash
kubectl logs deployment/config-server -n shopcloud
```
```bash
kubectl logs deployment/inventory-service -n shopcloud
```
```bash
kubectl logs deployment/kafka-monitoring-ui -n shopcloud
```
```bash
kubectl logs deployment/nodered -n shopcloud
```
```bash
kubectl logs deployment/notification-service -n shopcloud
```
```bash
kubectl logs deployment/order-service -n shopcloud
```
```bash
kubectl logs deployment/payment-service -n shopcloud
```
```bash
kubectl logs deployment/product-service -n shopcloud
```
```bash
kubectl logs deployment/rating-reviews-service -n shopcloud
```
```bash
kubectl logs deployment/ui-service -n shopcloud
```
```bash
kubectl logs deployment/user-service -n shopcloud
```
```bash
kubectl logs job/init-kafka -n shopcloud
```
```bash
kubectl logs -l app=kafka-broker -n shopcloud
```
```bash
kubectl logs -l app=zookeeper -n shopcloud
```
```bash
kubectl logs -f deployment/api-gateway -n shopcloud
```
```bash
kubectl logs <full-pod-name> -n shopcloud
```