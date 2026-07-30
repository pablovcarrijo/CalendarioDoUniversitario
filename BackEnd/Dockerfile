#Baixo uma imagem do node:22-slim do docker hub
FROM node:22-slim

#Cria e entra na pasta /app do container
WORKDIR /app

#Copia para o /app tudo do código
COPY . .

#Instala primeiro as dependências
RUN npm ci

#Gera o Prisma Client
RUN npx prisma generate

#A porta que será usada
EXPOSE 3000

#Comandos que irá rodar no terminal
CMD ["npm", "start"]