# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

# Habilita pnpm a través de corepack (incluido en Node 22)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiamos los manifiestos primero para aprovechar la caché de capas:
# si no cambian package.json / pnpm-lock.yaml, Docker reutiliza la capa
# de dependencias en builds sucesivos.
COPY package.json pnpm-lock.yaml ./

# Instalación reproducible sin modificar el lockfile
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código fuente
COPY . .

# Generamos el bundle de producción (tsc + vite build)
RUN pnpm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Eliminamos la config por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos solo el artefacto estático desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx optimizada para SPA (TanStack Router usa rutas
# del lado del cliente, por lo que cualquier ruta desconocida debe servir
# index.html en lugar de devolver 404).
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
