# Use a lightweight Node.js image with Bun installed
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy package files and lock file
COPY package.json bun.lockb /app/

# Install dependencies using Bun
RUN bun install

# Copy the rest of the app code
COPY . /app

# Expose the port your app will run on (if needed)
EXPOSE 8080

# Command to run the Bun app
CMD ["bun", "run", "--hot", "src/index.ts"]
