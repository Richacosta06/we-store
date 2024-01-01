# Description



## Run Dev

1. clone repository
2. copy ```.env.template``` rename it to ```.env``` and change environment variables
3. Install dependencies ```npm install```
4. build database ```docker compose up -d```
5. run migrations  ```npx prisma migrate dev```
6. run seed ```npm run seed```
7. run project ```npm run dev```



## Run Prod