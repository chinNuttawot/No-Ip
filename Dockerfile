# ใช้ Node.js 20.18.1 Alpine Version
FROM node:20.18.1

# Set Working Directory
WORKDIR /app

# Copy package.json และ package-lock.json แล้วติดตั้ง Dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy ไฟล์ทั้งหมดไปใน Image
COPY . .

# รัน server.js ตอน Container Start
CMD ["npm", "start"]
