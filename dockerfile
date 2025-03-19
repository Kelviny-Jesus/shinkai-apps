# Usa uma imagem base com Node.js e Rust
FROM node:20

# Instala dependências do Rust
RUN apt update && apt install -y \
    curl \
    wget \
    libssl-dev \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instala Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para dentro do contêiner
COPY . .

# Instala dependências do projeto
RUN npm install

# Compila o projeto
RUN npx nx build shinkai-desktop

# Comando para rodar a aplicação
CMD ["npx", "nx", "serve:tauri", "shinkai-desktop"]
