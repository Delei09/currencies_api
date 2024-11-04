# API de Conversão de Moedas

Esta API permite o cadastro de usuários, autenticação e acesso a dados de moedas em tempo real. É construída com NestJS e utiliza um banco de dados para armazenar informações dos usuários.

## Funcionalidades

- **Cadastro de Usuário**: Permite que novos usuários se registrem na API.
- **Autenticação**: Os usuários podem se autenticar para acessar as funcionalidades protegidas.
- **Dados de Moedas em Tempo Real**: A API fornece cotações de moedas atualizadas em tempo real.

## Pré-requisitos

Antes de iniciar a API, é necessário ter o Docker e o Docker Compose instalados em seu sistema.

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Delei09/currencies_backend
   cd currencies_backend
   ```

2. **Inicie os serviços do Docker**:
   ```bash
   docker-compose up -d
   ```
   Este comando inicializa os contêineres definidos no `docker-compose.yml`, rodando-os em modo de desmonte (background).

3. **Instale as dependências**:
   ```bash
   npm install
   ```
   Isso instala todos os pacotes e dependências necessárias listadas no `package.json`.

4. **Inicie a aplicação**:
   ```bash
   npm run start
   ```
   Este comando inicia o servidor da aplicação.

## Testando a API com Swagger

A documentação da API pode ser acessada via Swagger UI. Após iniciar a API, você pode acessar o Swagger em:

http://localhost:4000/api

No Swagger UI, você pode testar todos os endpoints da API interativamente. Basta preencher os campos necessários e clicar em "Execute" para fazer chamadas à API.


### Implementações pendentes

- Arrumar os teste unitarios
- Criar cache de cotação
- Arrumar a forma que esta salvando as cotações no mongo
- Criar rotas corretas para alteração de alguns dados
- Melhorar a comunicação websocket
- Criar um docker-compose para subir o projeto por ele
- Adicionar o serviço do nginx para fazer balanceamento de carga
- Configurar lint e prettier