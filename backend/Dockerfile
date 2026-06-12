# --- STAGE 1: Build Environment ---
FROM node:20-alpine AS builder

# Set up the working directory inside the container
WORKDIR /app

# Corepack enables native pnpm usage without global npm installation overrides
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace package manifests to cache your dependencies layer
COPY package.json pnpm-lock.yaml* ./

# Install ALL packages (including devDependencies like typescript, @types/*)
RUN pnpm install --frozen-lockfile

# Copy the rest of the backend source files
COPY . .

# Compile TypeScript to JavaScript (generates the dist/ folder)
RUN pnpm run build

# --- STAGE 2: Lightweight Production Runtime ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifest files again to install only production dependencies
COPY package.json pnpm-lock.yaml* ./

# Install ONLY production dependencies to keep the container lightweight
RUN pnpm install --prod --frozen-lockfile

# Copy the compiled build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Render typically runs web apps on port 10000 by default if not overridden
EXPOSE 10000
ENV PORT=10000

# Fire up your live compiled production entrypoint
CMD ["node", "dist/index.js"]