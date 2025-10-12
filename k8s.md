```sh
minikube config set memory 6000 && minikube start && minikube addons enable ingress && minikube addons enable ingress-dns && minikube tunnel
````

```sh
minikube stop && minikube delete --all
````

```sh
docker system prune -af
````