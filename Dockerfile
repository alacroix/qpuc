FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY . /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --frozen-lockfile --offline
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN  --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=server --prod /prod/server

FROM base AS server
ENV PORT 8080
ENV NODE_ENV production
COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
EXPOSE 8080
CMD [ "pnpm", "start" ]

FROM nginx:alpine as client
COPY --from=build /usr/src/app/apps/client/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]