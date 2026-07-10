import type { KnowledgeData } from "../../pages/KnowledgeDetail";

export const k8sCommandsData: KnowledgeData = {
  name: "K8s 常用命令",
  description: "Kubernetes 集群管理、Pod 操作、服务部署等常用命令",
  icon: "K8",
  items: [
    {
      id: "k8s-01",
      title: "集群信息查看",
      tags: ["K8s", "集群", "节点"],
      excerpt: "查看 Kubernetes 集群状态、节点信息和版本",
      content: `## 集群基本信息

\`\`\`bash
# 查看集群信息
kubectl cluster-info

# 查看 Kubernetes 版本
kubectl version --short

# 查看 API 资源
kubectl api-resources

# 查看 API 组
kubectl api-groups
\`\`\`

## 节点管理

\`\`\`bash
# 查看所有节点
kubectl get nodes

# 查看节点详细信息
kubectl get nodes -o wide

# 查看节点状态
kubectl get nodes --show-labels

# 描述特定节点
kubectl describe node <node-name>

# 查看节点资源使用情况
kubectl top nodes

# 标记节点（用于调度）
kubectl label nodes <node-name> env=production

# 驱逐节点上的 Pod
kubectl drain <node-name> --ignore-daemonsets
\`\`\``,
    },
    {
      id: "k8s-02",
      title: "Pod 操作命令",
      tags: ["K8s", "Pod", "容器"],
      excerpt: "Pod 的创建、查看、删除和调试操作",
      content: `## Pod 查看

\`\`\`bash
# 列出所有 Pod
kubectl get pods

# 列出指定命名空间的 Pod
kubectl get pods -n <namespace>

# 查看所有命名空间的 Pod
kubectl get pods --all-namespaces

# 查看 Pod 详细信息
kubectl get pods -o wide

# 描述 Pod
kubectl describe pod <pod-name>

# 查看 Pod YAML 配置
kubectl get pod <pod-name> -o yaml
\`\`\`

## Pod 调试

\`\`\`bash
# 进入 Pod 容器
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -c <container-name> -- /bin/sh

# 查看 Pod 日志
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # 实时跟踪
kubectl logs <pod-name> -c <container-name>

# 查看之前容器的日志（重启场景）
kubectl logs <pod-name> --previous

# 复制文件到 Pod
kubectl cp ./local-file <pod-name>:/path/in/container

# 从 Pod 复制文件
kubectl cp <pod-name>:/path/in/container ./local-file
\`\`\`

## Pod 管理

\`\`\`bash
# 删除 Pod
kubectl delete pod <pod-name>
kubectl delete pod <pod-name> --grace-period=0 --force  # 强制删除

# 重启 Deployment（间接重启 Pod）
kubectl rollout restart deployment/<deployment-name>
\`\`\``,
    },
    {
      id: "k8s-03",
      title: "Deployment 管理",
      tags: ["K8s", "Deployment", "部署"],
      excerpt: "Deployment 的创建、扩缩容、滚动更新操作",
      content: `## Deployment 查看

\`\`\`bash
# 列出 Deployments
kubectl get deployments

# 查看详细信息
kubectl get deployments -o wide

# 描述 Deployment
kubectl describe deployment <deployment-name>

# 查看 ReplicaSets
kubectl get replicasets
\`\`\`

## 扩缩容操作

\`\`\`bash
# 扩容到 5 个副本
kubectl scale deployment <deployment-name> --replicas=5

# 基于 CPU 自动扩缩容
kubectl autoscale deployment <deployment-name> \
  --min=2 --max=10 --cpu-percent=80

# 查看 HPA 状态
kubectl get hpa
\`\`\`

## 滚动更新

\`\`\`bash
# 更新镜像
kubectl set image deployment/<deployment-name> \
  <container-name>=<new-image>:<tag>

# 查看更新状态
kubectl rollout status deployment/<deployment-name>

# 查看更新历史
kubectl rollout history deployment/<deployment-name>

# 回滚到上一个版本
kubectl rollout undo deployment/<deployment-name>

# 回滚到指定版本
kubectl rollout undo deployment/<deployment-name> --to-revision=2
\`\`\``,
    },
    {
      id: "k8s-04",
      title: "Service 服务管理",
      tags: ["K8s", "Service", "网络"],
      excerpt: "Service 的创建、查看和端口转发操作",
      content: `## Service 查看

\`\`\`bash
# 列出 Services
kubectl get services

# 查看所有命名空间的 Services
kubectl get services --all-namespaces

# 描述 Service
kubectl describe service <service-name>

# 查看 Endpoints
kubectl get endpoints <service-name>
\`\`\`

## 端口转发

\`\`\`bash
# 本地端口转发到 Service
kubectl port-forward service/<service-name> 8080:80

# 本地端口转发到 Pod
kubectl port-forward <pod-name> 8080:80

# 监听所有接口
kubectl port-forward --address 0.0.0.0 <pod-name> 8080:80
\`\`\`

## Service 类型

\`\`\`yaml
# ClusterIP - 内部访问（默认）
type: ClusterIP

# NodePort - 节点端口暴露
type: NodePort
ports:
  - nodePort: 30080
    port: 80

# LoadBalancer - 负载均衡器
type: LoadBalancer

# ExternalName - 外部服务
type: ExternalName
externalName: my.database.example.com
\`\`\``,
    },
    {
      id: "k8s-05",
      title: "ConfigMap 与 Secret",
      tags: ["K8s", "配置", "密钥"],
      excerpt: "配置管理和敏感信息存储操作",
      content: `## ConfigMap 操作

\`\`\`bash
# 创建 ConfigMap（从字面值）
kubectl create configmap app-config \
  --from-literal=key1=value1 \
  --from-literal=key2=value2

# 从文件创建
kubectl create configmap app-config --from-file=config.properties

# 从目录创建
kubectl create configmap app-config --from-file=./config-dir/

# 查看 ConfigMap
kubectl get configmaps
kubectl describe configmap <configmap-name>

# 导出 ConfigMap
kubectl get configmap <configmap-name> -o yaml > configmap.yaml
\`\`\`

## Secret 操作

\`\`\`bash
# 创建 generic Secret
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123

# 从文件创建 Secret
kubectl create secret tls tls-secret \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key

# 查看 Secret（base64 编码）
kubectl get secrets
kubectl describe secret <secret-name>

# 解码 Secret
kubectl get secret <secret-name> -o jsonpath='{.data.password}' | base64 -d
\`\`\``,
    },
    {
      id: "k8s-06",
      title: "故障排查命令",
      tags: ["K8s", "排查", "调试"],
      excerpt: "常用故障排查和问题诊断命令",
      content: `## 资源状态检查

\`\`\`bash
# 查看失败 Pod 的原因
kubectl get pods --field-selector=status.phase!=Running

# 查看 Pending Pod
kubectl get pods --field-selector=status.phase=Pending

# 查看 CrashLoopBackOff Pod
kubectl get pods | grep CrashLoopBackOff
\`\`\`

## 事件查看

\`\`\`bash
# 查看命名空间事件
kubectl get events --sort-by='.lastTimestamp'

# 查看特定资源事件
kubectl describe pod <pod-name>

# 持续监控事件
kubectl get events -w
\`\`\`

## 常见问题排查

\`\`\`bash
# 检查节点资源
kubectl top nodes
kubectl top pods

# 检查 PersistentVolume
kubectl get pv
kubectl get pvc

# 检查 Ingress
kubectl get ingress
kubectl describe ingress <ingress-name>

# 检查 RBAC 权限
kubectl auth can-i create pods
kubectl auth can-i list deployments -n kube-system
\`\`\``,
    },
  ],
};
