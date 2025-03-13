FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json

RUN bun install

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN mkdir -p /app/uploads

RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile server \
  ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app /app

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3001