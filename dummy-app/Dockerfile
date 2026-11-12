FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies (layer is cached unless package files change)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION} \
    PORT=3000

# Run as the non-root user that ships with the node image
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
