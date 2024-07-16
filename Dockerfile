# Usar una imagen base de Node.js con Alpine Linux
FROM node:21-alpine3.18

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar Python, herramientas de construcción y las bibliotecas necesarias para canvas
RUN apk add --no-cache python3 make g++ pkgconf \
    && apk add --no-cache pixman-dev cairo-dev pango-dev jpeg-dev giflib-dev \
    && ln -sf python3 /usr/bin/python

# Copiar archivos necesarios para la instalación de npm
COPY package.json ./
COPY tsconfig.json ./

# Copiar el código fuente
COPY src ./src

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Exponer el puerto que la aplicación usará
EXPOSE 4000

ARG ENVS_SERVER_MAIN
ENV PORT=4000 \
    DATABASE_URL=${DATABASE_URL} \
    JWT_TOKEN=${JWT_TOKEN} \
    NODE_ENV=production \
    SECRET_KEY_ONE=${SECRET_KEY_ONE} \
    SECRET_KEY_TWO=${SECRET_KEY_TWO} \
    CLIENT_URL=${CLIENT_URL} \
    REDIS_HOST=${REDIS_HOST} \
    CLOUD_NAME=${CLOUD_NAME} \
    CLOUD_API_KEY=${CLOUD_API_KEY} \
    CLOUD_API_SECRET=${CLOUD_API_SECRET} \
    SENDER_EMAIL=${SENDER_EMAIL} \
    SENDER_EMAIL_PASSWORD=${SENDER_EMAIL_PASSWORD} \
    SENDGRID_API_KEY=${SENDGRID_API_KEY}\
    SENDGRID_SENDER=${SENDGRID_SENDER}

CMD ["npm", "run", "dev"]

