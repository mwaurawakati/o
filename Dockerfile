FROM debian:bookworm AS builder

RUN apt-get update && apt-get install -y \
    gcc-aarch64-linux-gnu \
    g++-aarch64-linux-gnu \
    libc6-dev:arm64 \
    libgtk-3-dev:arm64 \
    libwebkit2gtk-4.0-dev:arm64 \
    pkg-config \
    curl \
    build-essential

WORKDIR /app
COPY . .

RUN rustup target add aarch64-unknown-linux-gnu
ENV CC_aarch64_unknown_linux_gnu=aarch64-linux-gnu-gcc \
    CXX_aarch64_unknown_linux_gnu=aarch64-linux-gnu-g++

RUN cargo build --release --target aarch64-unknown-linux-gnu

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libgtk-3-0:arm64 \
    libwebkit2gtk-4.0-37:arm64

WORKDIR /app
COPY --from=builder /app/target/aarch64-unknown-linux-gnu/release/your_binary_name .

CMD ["./your_binary_name"]
