resource "azurerm_virtual_network" "vnet" {
  name                = "${var.name_prefix}-vnet"
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = [var.address_space]
  tags                = var.tags
}

resource "azurerm_subnet" "public" {
  name                 = "${var.name_prefix}-public"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.public_address_prefix]
}

resource "azurerm_subnet" "aks" {
  name                 = "${var.name_prefix}-aks"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.aks_address_prefix]
}

resource "azurerm_subnet" "database" {
  name                 = "${var.name_prefix}-database"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.database_address_prefix]
  service_endpoints    = ["Microsoft.Storage"]
  delegation {
    name = "postgres-flexible-server"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_network_security_group" "nsg-public" {
  name                = "${var.name_prefix}-public-nsg"
  resource_group_name = var.resource_group_name
  location            = var.location
}

resource "azurerm_network_security_group" "nsg-aks" {
  name                = "${var.name_prefix}-aks-nsg"
  resource_group_name = var.resource_group_name
  location            = var.location

  security_rule {
    name                       = "AllowHTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_security_group" "nsg-database" {
  name                = "${var.name_prefix}-database-nsg"
  resource_group_name = var.resource_group_name
  location            = var.location
  security_rule {
    name                       = "AllowAKSSubnet"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = var.aks_address_prefix
    destination_address_prefix = var.database_address_prefix
  }
}

resource "azurerm_subnet_network_security_group_association" "public-nsg-assoc" {
  network_security_group_id = azurerm_network_security_group.nsg-public.id
  subnet_id                 = azurerm_subnet.public.id
}

resource "azurerm_subnet_network_security_group_association" "aks-nsg-assoc" {
  network_security_group_id = azurerm_network_security_group.nsg-aks.id
  subnet_id                 = azurerm_subnet.aks.id
}

resource "azurerm_subnet_network_security_group_association" "database-nsg-assoc" {
  network_security_group_id = azurerm_network_security_group.nsg-database.id
  subnet_id                 = azurerm_subnet.database.id
}

resource "azurerm_public_ip" "pip" {
  name                = "aks-pip"
  resource_group_name = var.resource_group_name
  location            = var.location
  allocation_method   = "Static"
}

resource "azurerm_nat_gateway" "nat" {
  name                = "aks-nat"
  resource_group_name = var.resource_group_name
  location            = var.location
}

resource "azurerm_nat_gateway_public_ip_association" "nat-pip-assoc" {
  nat_gateway_id       = azurerm_nat_gateway.nat.id
  public_ip_address_id = azurerm_public_ip.pip.id
}

resource "azurerm_subnet_nat_gateway_association" "aks-nat-assoc" {
  nat_gateway_id = azurerm_nat_gateway.nat.id
  subnet_id      = azurerm_subnet.aks.id
}

