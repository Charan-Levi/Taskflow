resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${var.name_prefix}"
  resource_group_name = var.resource_group_name
  location            = var.location
  kubernetes_version  = "1.34.10"
  dns_prefix          = var.name_prefix
  node_resource_group = "${var.name_prefix}-nodegroup"
  sku_tier            = "Free"

  default_node_pool {
    name                 = "system"
    auto_scaling_enabled = true
    node_count           = 1
    min_count            = 1
    max_count            = 2
    os_sku               = "Ubuntu2404"
    type                 = "VirtualMachineScaleSets"
    max_pods             = 60
    vnet_subnet_id       = var.vnet_subnet_id
    vm_size              = var.node_vmsize
    upgrade_settings {
      max_surge = "33%"
    }
  }

  identity {
    type = "SystemAssigned"
  }
  oidc_issuer_enabled       = true
  workload_identity_enabled = true

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
    service_cidr   = "10.100.0.0/16"
    dns_service_ip = "10.100.0.10"
  }

  tags = var.tags

}

resource "azurerm_role_assignment" "Acrpull" {
  role_definition_name = "AcrPull"
  scope                = var.acr_id
  principal_id         = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
}